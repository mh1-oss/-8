
import React from 'react';

const CategoryFilter = ({ categories, activeCat, onSelectCategory }) => {
    return (
        <div className="categories-bar">
            {categories.map(cat => (
                <button
                    key={cat}
                    className={`category-btn ${activeCat === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
