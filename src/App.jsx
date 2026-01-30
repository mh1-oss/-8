import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import RecipePage from './pages/RecipePage'

function App() {
  const location = useLocation();
  const [meals, setMeals] = useState([]);
  // Load cart from localStorage on initialization
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false); // حالة فتح/إغلاق السلة
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState('Beef'); // التصنيف النشط

  // Auto-save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const categories = ['Beef', 'Chicken', 'Dessert', 'Seafood', 'Pasta', 'Vegan', 'Breakfast', 'Pizza'];

  // دالة جلب البيانات حسب التصنيف أو البحث
  const fetchMeals = async (query = '', isCategory = false) => {
    setLoading(true);
    let url = isCategory
    if (query === 'Pizza') {
      // لأن البيتزا ليست تصنيفاً رسمياً، نبحث عنها بالاسم
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=pizza`;
    } else if (isCategory) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`;
    } else {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.meals) {
        const enriched = data.meals.slice(0, 8).map(m => ({
          ...m,
          price: Math.floor(Math.random() * 10) + 15,
          rating: (Math.random() * (5 - 4) + 4).toFixed(1)
        }));
        setMeals(enriched);
      } else { setMeals([]); }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => {
    if (activeCat) {
      fetchMeals(activeCat, true);
    }
  }, [activeCat]);

  // إضافة للسلة (مع الكمية)
  const addToCart = (meal) => {
    const existingItem = cartItems.find(item => item.idMeal === meal.idMeal);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.idMeal === meal.idMeal ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...meal, qty: 1 }]);
    }
  };

  // وظيفة عرض الكل (تجلب كمية أكبر من البيانات)
  const handleViewAll = () => {
    setActiveCat(null);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
      .then(res => res.json())
      .then(data => {
        if (data.meals) {
          const enriched = data.meals.map(m => ({
            ...m,
            price: Math.floor(Math.random() * 10) + 15,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1)
          }));
          setMeals(enriched);
        }
      });
  };

  return (
    <div className="container">
      <Navbar cartCount={cartItems.length} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <Home
              meals={meals}
              loading={loading}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              categories={categories}
              fetchMeals={fetchMeals}
              addToCart={addToCart}
              handleViewAll={handleViewAll}
            />
          } />
          <Route path="/cart" element={
            <CartPage
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          } />
          <Route path="/meal/:id" element={
            <RecipePage addToCart={addToCart} />
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App