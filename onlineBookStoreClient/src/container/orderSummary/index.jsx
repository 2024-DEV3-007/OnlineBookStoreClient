import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const OrderSummary = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, username, password } = location.state || {};

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity, 0
  );

  const handleCancel = () => {
      navigate('/books', { state: { username, password } });
  };

const handleLogout = () => {
   setTimeout(() => {
            window.location.reload();
          }, 1000);
    navigate("/");
  };

 return (
     <div className="order-summary-container">
       <div className="header">
         <h1 className="bookstore-heading" data-testid="heading">Online Book Store</h1>
         <button className="logout-btn" data-testid="logout" onClick={handleLogout}>Logout</button>
       </div>

       <div className="order-summary" >
         <h2>Order Placed Successfully</h2>
         <div className="order-details">
           {cartItems.length > 0 ? (
             cartItems.map((item) => (
               <div key={item.book.id} className="order-item" data-testid={`quantity-${item.book.id}`}>
                 <p>{item.book.title} : {item.quantity} * €{item.book.price.toFixed(2)} = €{(item.book.price * item.quantity).toFixed(2)}</p>
               </div>
             ))
           ) : (
             <p>No items in the cart.</p>
           )}
         </div>
         <div className="grand-total">
           <h3>Grand Total: €{grandTotal.toFixed(2)}</h3>
         </div>
         <button className="cancel-button" data-testid="cancel-button" onClick={handleCancel}>Go Back Home </button>
       </div>
     </div>
   );
    };

 export default OrderSummary;