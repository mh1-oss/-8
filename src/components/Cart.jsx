
import React from 'react';

const Cart = ({ isOpen, onClose, cartItems }) => {
    if (!isOpen) return null;

    return (
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
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Cart;
