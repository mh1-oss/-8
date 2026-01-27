import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, setCartItems }) => {
    const navigate = useNavigate();

    // --- State Management ---
    const [paymentMethod, setPaymentMethod] = useState('credit'); 
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [address, setAddress] = useState({
        label: 'Home',
        details: '123 Main Street, Apt 4B'
    });

    // States للفاتورة (الوصل)
    const [showReceipt, setShowReceipt] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState('');

    // --- Calculations ---
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    // --- Functions ---
    const onBack = () => navigate(-1);

    const updateQuantity = (id, delta) => {
        const newCart = cartItems.map(item => {
            if (item.idMeal === id) return { ...item, qty: (item.qty || 1) + delta };
            return item;
        }).filter(item => item.qty > 0);
        setCartItems(newCart);
    };

    // دالة إتمام الطلب وتوليد الوصل
    const handlePlaceOrder = () => {
        if (cartItems.length === 0) return;
        
        // توليد رقم طلب وتاريخ عشوائي
        setOrderId('#' + Math.floor(100000 + Math.random() * 900000));
        setOrderDate(new Date().toLocaleString());
        setShowReceipt(true);
    };

    // دالة إغلاق الوصل ومسح السلة
    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setCartItems([]); // تفريغ السلة
        navigate('/'); // الرجوع للصفحة الرئيسية
    };

    return (
        <div className="container checkout-container">
            {/* Header */}
            <div className="checkout-header">
                <button className="back-btn" onClick={onBack}>←</button>
                <h1>Checkout</h1>
            </div>

            {/* Address Section */}
            <h3 className="section-title">Delivery Address</h3>
            <div className="dark-card">
                <div className="address-info" style={{width: '100%'}}>
                    <div className="icon-box">📍</div>
                    {isEditingAddress ? (
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '5px'}}>
                            <input type="text" value={address.label} onChange={(e) => setAddress({...address, label: e.target.value})} style={inputStyle}/>
                            <input type="text" value={address.details} onChange={(e) => setAddress({...address, details: e.target.value})} style={inputStyle}/>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{address.label}</div>
                            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>{address.details}</div>
                        </div>
                    )}
                </div>
                <div style={{ color: '#ff4500', cursor: 'pointer', marginLeft: '10px' }} onClick={() => setIsEditingAddress(!isEditingAddress)}>
                    {isEditingAddress ? 'Save' : '✏️'}
                </div>
            </div>

            {/* Items */}
            <h3 className="section-title">Order Summary</h3>
            {cartItems.map(item => (
                <div className="order-item" key={item.idMeal}>
                    <img src={item.strMealThumb} className="order-img" alt="" />
                    <div className="order-details">
                        <h4>{item.strMeal}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="qty-controls">
                                <button className="qty-btn" onClick={() => updateQuantity(item.idMeal, -1)}>−</button>
                                <span>{item.qty || 1}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.idMeal, 1)}>+</button>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>${(item.price * (item.qty || 1)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Payment Methods (تم التعديل هنا) */}
            <h3 className="section-title">Payment Method</h3>
            <div className="payment-grid">
                <div className={`payment-card ${paymentMethod === 'credit' ? 'selected' : ''}`} onClick={() => setPaymentMethod('credit')}>
                    {paymentMethod === 'credit' && <div className="check-mark">✓</div>}
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>💳</div>
                    <div style={{ fontWeight: 'bold' }}>Credit Card</div>
                    <div style={{ fontSize: '12px', color: '#a0a0a0' }}>**** 4242</div>
                </div>

                {/* خيار الدفع عند الاستلام */}
                <div className={`payment-card ${paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cash')}>
                    {paymentMethod === 'cash' && <div className="check-mark">✓</div>}
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>💵</div>
                    <div style={{ fontWeight: 'bold' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '12px', color: '#a0a0a0' }}>Pay at door</div>
                </div>
            </div>

            {/* Totals & Button */}
            <div className="bill-card">
                <div className="bill-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>${deliveryFee}</span></div>
                <div className="bill-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="total-row"><span>Total</span><span style={{ color: 'var(--primary-color)' }}>${total.toFixed(2)}</span></div>

                <button className="place-order-btn" onClick={handlePlaceOrder}>
                    <span>Place Order</span>
                    <span>${total.toFixed(2)}</span>
                </button>
            </div>

            {/* --- Receipt Modal (نافذة الوصل الحقيقي) --- */}
            {showReceipt && (
                <div className="receipt-overlay">
                    <div className="receipt-paper">
                        <div className="receipt-header">
                            <h2 style={{margin:0}}>CRAVE FIND</h2>
                            <p style={{margin:'5px 0', fontSize:'12px'}}>Original Receipt</p>
                            <div style={{fontSize:'12px', marginTop:'10px'}}>
                                <div>Date: {orderDate}</div>
                                <div>Order ID: {orderId}</div>
                            </div>
                        </div>

                        <div className="receipt-body">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="receipt-row">
                                    <span>{item.qty}x {item.strMeal.substring(0, 15)}</span>
                                    <span>${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="receipt-divider"></div>

                        <div className="receipt-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="receipt-row"><span>Delivery</span><span>${deliveryFee}</span></div>
                        <div className="receipt-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                        
                        <div className="receipt-row receipt-total">
                            <span>TOTAL</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <div style={{textAlign:'center', fontSize:'12px', marginTop:'15px'}}>
                            <p>Payment: {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}</p>
                            <p>Address: {address.label}</p>
                            <p style={{marginTop:'10px'}}>*** Thank You! ***</p>
                        </div>

                        <div className="receipt-actions">
                            <button className="print-btn" onClick={() => window.print()}>Print 🖨️</button>
                            <button className="close-receipt-btn" onClick={handleCloseReceipt}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    background: '#2d2724', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', width: '100%', outline: 'none'
};

export default CartPage;