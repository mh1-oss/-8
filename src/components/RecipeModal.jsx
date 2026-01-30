import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RecipeModal = ({ meal, onClose, onAddToCart }) => {
    const navigate = useNavigate();
    const [details, setDetails] = useState(meal);
    const [loading, setLoading] = useState(!meal.strInstructions);

    useEffect(() => {
        if (!meal.strInstructions) {
            setLoading(true);
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(res => res.json())
                .then(data => {
                    if (data.meals && data.meals[0]) {
                        setDetails({ ...meal, ...data.meals[0] });
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [meal]);

    const handleViewFull = () => {
        onClose();
        navigate(`/meal/${meal.idMeal}`);
    };

    // Helper to extract first few ingredients for the summary
    const getSummaryIngredients = () => {
        if (!details) return "";
        let ingredients = [];
        for (let i = 1; i <= 5; i++) {
            const ingredient = details[`strIngredient${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(ingredient);
            }
        }
        return ingredients.join(', ') + (ingredients.length > 0 ? '...' : '');
    };

    if (!details) return null;

    return (
        <motion.div
            className="modal-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="modal-content dark-theme-modal"
                onClick={e => e.stopPropagation()}
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button className="close-btn modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header-clean">
                    <img src={details.strMealThumb} alt={details.strMeal} />
                </div>

                <div className="modal-body-clean">
                    <div className="modal-top-info">
                        <h2>{details.strMeal}</h2>
                        <span className="highlight-price">${details.price}</span>
                    </div>

                    <p className="modal-summary">
                        {loading ? (
                            <span className="loading-text">Loading ingredients...</span>
                        ) : (
                            <>
                                <strong>Ingredients: </strong>
                                {getSummaryIngredients() || 'See full details for ingredients.'}
                            </>
                        )}
                    </p>

                    <div className="modal-actions">
                        <button className="add-btn primary" onClick={() => {
                            onAddToCart(details);
                            onClose();
                        }}>
                            Add to Cart
                        </button>
                        <button className="view-full-btn" onClick={handleViewFull}>
                            View Full Details →
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
export default RecipeModal;
