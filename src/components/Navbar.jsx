
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
    return (
        <nav className="navbar">
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
