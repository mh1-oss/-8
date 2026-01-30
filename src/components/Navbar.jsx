
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
    const location = useLocation();
    const isRecipePage = location.pathname.startsWith('/meal/');
    console.log("Navbar check:", location.pathname, "isRecipePage:", isRecipePage);

    return (
        <nav className={`navbar ${isRecipePage ? 'transparent-navbar' : ''}`}>
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
