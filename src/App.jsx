import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [meals, setMeals] = useState([]);
  const [cartItems, setCartItems] = useState([]); // مصفوفة لتخزين الوجبات المضافة
  const [isCartOpen, setIsCartOpen] = useState(false); // حالة فتح/إغلاق السلة
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState('Beef'); // التصنيف النشط

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

  // إضافة للسلة
  const addToCart = (meal) => {
    setCartItems([...cartItems, meal]);
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
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Crave<span style={{ color: 'var(--primary-color)' }}>Find</span> <img src="/restaurant_menu.png" alt="" /></div>
        <button className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
        </button>
      </nav>

      {/* Hero */}
      <header className="hero">
        <h1>Find your next craving</h1>
        <div className="search-container">
          <input type="text" placeholder="Search for food..." onChange={(e) => fetchMeals(e.target.value)} />
        </div>
      </header>

      {/* التصنيفات */}
      <div className="categories-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCat === cat ? 'active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-header">
        <h2>Recommended for you</h2>
        <span className="view-all" onClick={handleViewAll}>View all</span>
      </div>

      {/* Grid الوجبات */}
      <div className="grid">
        {loading ? <p>Loading...</p> : meals.map(meal => (
          <div className="card" key={meal.idMeal}>
            <div className="img-wrapper">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="rating">⭐ {meal.rating}</div>
            </div>
            <div className="card-content">
              <div className="card-header">
                <h3>{meal.strMeal.substring(0, 15)}...</h3>
                <span className="price">${meal.price}</span>
              </div>
              <button className="add-btn" onClick={() => addToCart(meal)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة السلة Modal */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="cart-modal">
            <h2>Your Cart 🛒</h2>
            {cartItems.length === 0 ? <p>Your cart is empty</p> :
              cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <span>{item.strMeal}</span>
                  <strong>${item.price}</strong>
                </div>
              ))
            }
            <div style={{ marginTop: '20px', borderTop: '2px solid #444', paddingTop: '10px' }}>
              <strong>Total: ${cartItems.reduce((acc, item) => acc + item.price, 0)}</strong>
            </div>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App