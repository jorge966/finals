import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../Home.css'; // Ensure the CSS path is correct

function Home() {
    const [posts, setPosts] = useState([]);
    const [sortKey, setSortKey] = useState('created_at');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [sortKey, searchTerm]);

    async function fetchPosts() {
        let query = supabase
            .from('posts')
            .select('*')
            .ilike('title', `%${searchTerm}%`)
            .order(sortKey, { ascending: sortKey === 'created_at' });

        const { data, error } = await query;

        if (error) console.log('Error fetching posts:', error);
        else setPosts(data);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ margin: '10px' }}
            />
            <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
                style={{ margin: '10px' }}
            >
                <option value="created_at">Sort by Created Time</option>
                <option value="upvotes">Sort by Upvotes</option>
            </select>
            <div className="cards-container">
                {posts.map(post => (
                    <div key={post.id} className="card">
                        <div className="card-header">
                            <h3>{post.title}</h3>
                        </div>
                        <div className="card-body">
                            <p>{post.content}</p>
                            <p>Created at: {new Date(post.created_at).toLocaleString('en-US', {
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit',  
                                hour12: true 
                            })}</p>
                            <p>Upvotes: {post.upvotes}</p>
                            <p>Downvotes: {post.downvotes}</p>
                        </div>
                        <div className="card-footer">
                            <Link to={`/posts/${post.id}`}>View Post</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
