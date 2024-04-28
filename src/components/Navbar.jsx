import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">Game OST Forum</div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/create-post">Create Post</Link>
      </div>
    </nav>
  );
}

export default Navbar;
