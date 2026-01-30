
import React, { useState } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import MealList from '../components/MealList';
import RecipeModal from '../components/RecipeModal';
import PageTransition from '../components/PageTransition';
import { AnimatePresence } from 'framer-motion';

const Home = ({ meals, loading, activeCat, setActiveCat, categories, fetchMeals, addToCart, handleViewAll }) => {
    const [selectedMeal, setSelectedMeal] = useState(null);

    return (
        <PageTransition>
            <Hero onSearch={fetchMeals} />

            <CategoryFilter
                categories={categories}
                activeCat={activeCat}
                onSelectCategory={setActiveCat}
            />

            <div className="section-header">
                <h2>Recommended for you</h2>
                <span className="view-all" onClick={handleViewAll}>View all</span>
            </div>

            <MealList
                meals={meals}
                loading={loading}
                onAddToCart={addToCart}
                onMealClick={setSelectedMeal}
            />

            <AnimatePresence>
                {selectedMeal && (
                    <RecipeModal
                        meal={selectedMeal}
                        onClose={() => setSelectedMeal(null)}
                        onAddToCart={addToCart}
                    />
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Home;
