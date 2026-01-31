
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScroll, useMotionValueEvent } from 'framer-motion';
const Navbar = ({ cartCount }) => {
    const location = useLocation();
    const isRecipePage = location.pathname.startsWith('/meal/');
    const [isTransparent, setIsTransparent] = useState(true);
    const { scrollY } = useScroll();

    // Monitor scroll
    useMotionValueEvent(scrollY, "change", (latest) => {
        // إذا نزل المستخدم أكثر من 50 بكسل، يصبح الـ Navbar ملوناً
        if (latest > 50) {
            setIsTransparent(false);
        } else {
            setIsTransparent(true);
        }
    });
    return (
        // Only apply transparency if we are on a Recipe Page AND at the top
        <nav className={`navbar ${isRecipePage && isTransparent ? 'transparent-navbar' : ''}`}>
            <div className="logo">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Crave<span style={{ color: 'var(--primary-color)' }}>Find</span> <img src="/restaurant_menu.png" alt="" />
                </Link>
            </div>
            <Link to="/cart" className="cart-icon" style={{ textDecoration: 'none', color: 'white' }}>
                <img src="/Curve.png" alt="" /> {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
        </nav>
    );
};

export default Navbar;
