import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function getYouTubeEmbedUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null; // Return null if the URL isn't a valid YouTube URL
}

function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    async function fetchPostAndComments() {
        setLoading(true);
        await fetchPost();
        await fetchComments();
        setLoading(false);
    }

    async function fetchPost() {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error) console.error('Error fetching post:', error);
        else {
            setPost(data);
            setEditTitle(data.title);
            setEditContent(data.content);
        }
    }

    async function fetchComments() {
        const { data, error } = await supabase.from('comments').select('*').eq('post_id', id).order('created_at', { ascending: false });
        if (error) console.error('Error fetching comments:', error);
        else setComments(data);
    }

    const handleVote = async (isUpvote) => {
        const columnToUpdate = isUpvote ? 'upvotes' : 'downvotes';
        const newValue = post[columnToUpdate] + 1;

        const { error } = await supabase
            .from('posts')
            .update({ [columnToUpdate]: newValue })
            .match({ id });

        if (error) {
            console.error(`Error updating ${columnToUpdate}:`, error);
            setPost((currentPost) => ({
                ...currentPost,
                [columnToUpdate]: currentPost[columnToUpdate] - 1
            }));
        } else {
            setPost((currentPost) => ({
                ...currentPost,
                [columnToUpdate]: newValue
            }));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        const { data, error } = await supabase.from('comments').insert([{ post_id: id, content: newComment }]);
        if (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        } else {
            setComments([data[0], ...comments]);
            setNewComment('');
        }
    };

    const handleEdit = async () => {
        if (!editing) {
            setEditing(true);
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .update({ title: editTitle, content: editContent })
            .match({ id });

        if (error) {
            console.error('Error updating post:', error);
            alert('Failed to update the post.');
        } else {
            setPost(data);
            setEditing(false);
            alert('Post updated successfully.');
        }
    };

    const handleDelete = async () => {
        const { data, error } = await supabase.from('posts').delete().match({ id });
        if (error) {
            console.error('Error deleting post:', error);
            alert(`Failed to delete the post: ${error.message}`);
        } else {
            console.log('Delete response:', data);
            alert('Post deleted successfully.');
            navigate('/'); // Redirect to the home page
        }
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>No post found.</div>;

    return (
        <div className="post-container">
            <div className="video-interactions-container">
                <div className="video-container">
                    {post.video_url && (
                        <iframe
                            width="560"
                            height="315"
                            src={getYouTubeEmbedUrl(post.video_url)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded YouTube"
                        ></iframe>
                    )}
                </div>
                <div className="interactions-container">
                    <button onClick={() => handleVote(true)}>Like ({post.upvotes || 0})</button>
                    <button onClick={() => handleVote(false)}>Dislike ({post.downvotes || 0})</button>
                    {editing ? (
                        <div>
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                            <button onClick={handleEdit}>Save Changes</button>
                            <button onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <h1>{post.title}</h1>
                            <p>{post.content}</p>
                            <button onClick={handleEdit}>Edit Post</button>
                            <button onClick={handleDelete}>Delete Post</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="comments-container">
                <h3>Comments</h3>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <p>{comment.content}</p>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                        <button onClick={() => handleDeleteComment(comment.id)} style={{color: 'red'}}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostPage;

