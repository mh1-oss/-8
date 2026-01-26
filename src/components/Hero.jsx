
import React from 'react';

const Hero = ({ onSearch }) => {
    return (
        <header className="hero">
            <h1>Find your next craving</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for food..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </header>
    );
};

export default Hero;
