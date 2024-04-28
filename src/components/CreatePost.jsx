import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');  // Changed from imageUrl to videoUrl

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { data, error } = await supabase
            .from('posts')
            .insert([
                { title, content, video_url: videoUrl }  // Use the correct column name as per your database schema
            ]);

        if (error) {
            alert('Error creating post: ' + error.message);
        } else {
            setTitle('');
            setContent('');
            setVideoUrl('');
            alert('Post created successfully!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
            <input type="url" placeholder="Video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required />
            <button type="submit">Create Post</button>
        </form>
    );
}

export default CreatePost;


