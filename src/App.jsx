import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import Navbar from './components/Navbar';  // Ensure you import the Navbar component
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <Navbar />  
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


