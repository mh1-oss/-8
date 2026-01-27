
import React from 'react';

const MealList = ({ meals, loading, onAddToCart }) => {
    return (
        <div className="grid">
            {loading ? <p>Loading...</p> : meals.map(meal => (
                <div className="card" key={meal.idMeal}>
                    <div className="img-wrapper">
                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                        <div className="rating">⭐ {meal.rating}</div>
                    </div>
                    <div className="card-content">
                        <div className="card-header">
                            <h3>{meal.strMeal}</h3>
                            <span className="price">${meal.price}</span>
                        </div>
                        <button className="add-btn" onClick={() => onAddToCart(meal)}>Add to Cart</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MealList;
