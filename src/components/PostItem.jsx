import React from 'react';

function PostItem({ post }) {
    return (
        <div className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="button">
                    Listen/Watch
                </a>
            )}
        </div>
    );
}

export default PostItem;

