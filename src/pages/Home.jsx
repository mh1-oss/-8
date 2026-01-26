
import React from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import MealList from '../components/MealList';

const Home = ({ meals, loading, activeCat, setActiveCat, categories, fetchMeals, addToCart, handleViewAll }) => {
    return (
        <>
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
            />
        </>
    );
};

export default Home;
