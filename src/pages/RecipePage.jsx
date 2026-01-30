import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { motion, useScroll, useTransform } from 'framer-motion';

const RecipePage = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);

    const [loading, setLoading] = useState(true);
    // Removed containerRef as we want window scroll

    const { scrollY } = useScroll(); // Use window scroll
    // Fixed positioning means we need to translate smoothly UP to create parallax
    const imageY = useTransform(scrollY, [0, 500], [0, -150]); // Move up naturally but slower than scroll
    const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);
    const imageBlur = useTransform(scrollY, [0, 300], ["0px", "10px"]);
    const headerTitleOpacity = useTransform(scrollY, [250, 350], [0, 1]);

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
        <div className="parallax-wrapper">
            {/* Motion Parallax Background */}
            <motion.div
                className="recipe-parallax-bg"
                style={{
                    backgroundImage: `url(${meal.strMealThumb})`,
                    y: imageY,
                    opacity: imageOpacity, // Restored fade for polish
                    zIndex: 1
                }}
            />

                

            {/* Scrollable Content Sheet */}
            <div className="recipe-sheet-container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="recipe-sheet">
                    <div className="sheet-handle"></div>

                    <h1 className="recipe-title-large">{meal.strMeal}</h1>

                    <div className="recipe-meta centered">
                        <span className="price-tag">${meal.price}</span>
                        <span className="rating-tag">⭐ {meal.rating}</span>
                        <span className="category-tag">{meal.strCategory}</span>
                    </div>

                    <div className="action-row">
                        <button className="add-btn large-btn" onClick={() => addToCart(meal)}>
                            Add to Cart
                        </button>
                    </div>

                    <div className="ingredients-section-clean">
                        <h3>Ingredients</h3>
                        <ul className="ingredients-grid">
                            {getIngredients().map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="instructions-section-clean">
                        <h3>Instructions</h3>
                        <div className="instructions-text-clean">
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
            </div>
        </div>
    );
};

export default RecipePage;
