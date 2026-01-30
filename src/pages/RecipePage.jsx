import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const RecipePage = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals && data.meals[0]) {
                    const fetchedMeal = data.meals[0];
                    // Add synthetic price/rating if missing
                    fetchedMeal.price = fetchedMeal.price || Math.floor(Math.random() * 10) + 15;
                    fetchedMeal.rating = fetchedMeal.rating || (Math.random() * (5 - 4) + 4).toFixed(1);
                    setMeal(fetchedMeal);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching meal:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    if (!meal) return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Recipe not found</div>;

    const getIngredients = () => {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients;
    };

    return (
        <PageTransition>
            <div className="container recipe-page">
                <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '20px' }}>←</span>
                </button>

                <div className="recipe-hero">
                    <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-img" />
                    <div className="recipe-info">
                        <h1>{meal.strMeal}</h1>
                        <div className="recipe-meta">
                            <span className="price-tag">${meal.price}</span>
                            <span className="rating-tag">⭐ {meal.rating}</span>
                            <span className="category-tag">{meal.strCategory}</span>
                        </div>
                        <button className="add-btn large-btn" onClick={() => addToCart(meal)}>
                            Add to Cart
                        </button>

                        <div className="ingredients-section">
                            <h3>Ingredients</h3>
                            <ul className="ingredients-grid">
                                {getIngredients().map((ing, idx) => (
                                    <li key={idx}>{ing}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="instructions-section">
                    <h3>Instructions</h3>
                    <div className="instructions-text">
                        {meal.strInstructions.split('\r\n').map((step, idx) => (
                            step.trim() && <p key={idx}>{step}</p>
                        ))}
                    </div>
                    {meal.strYoutube && (
                        <div className="video-section">
                            <h3>Video Tutorial</h3>
                            <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="video-link">
                                Watch on YouTube
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default RecipePage;
