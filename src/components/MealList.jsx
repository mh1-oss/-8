
import React from 'react';

const MealList = ({ meals, loading, onAddToCart, onMealClick }) => {
    return (
        <div className="grid">
            {loading ? <p>Loading...</p> : meals.map(meal => (
                <div className="card" key={meal.idMeal} onClick={() => onMealClick(meal)}>
                    <div className="img-wrapper">
                        <img src={meal.strMealThumb} alt={meal.strMeal} />
                        <div className="rating">⭐ {meal.rating}</div>
                    </div>
                    <div className="card-content">
                        <div className="card-header">
                            <h3>{meal.strMeal}</h3>
                            <span className="price">${meal.price}</span>
                        </div>
                        <button className="add-btn" onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(meal);
                        }}>Add to Cart</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MealList;
