import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {getHostName,API} from "../../utils/constants";
import './index.css';

const ShoppingCart = () => {

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [order, setOrder] = useState(false);
  const location = useLocation();
  const { username, password } = location.state || {};

useEffect(() => {
    fetchCartItems();
  }, []);
  const fetchCartItems = () => {

      axios
        .get('http://localhost:8080/api/cart', {
          headers: {
            Authorization: `Basic ${btoa(username + ':' + password)}`,
          },
        })
        .then((response) => {
          setCartItems(response.data);
          const cartItemFromResponse = response.data;
          const bookData = cartItemFromResponse.map(item => ({
            bookId: item.book.id,
            quantity: item.quantity
          }));

          console.log("bookData :", bookData);
          setBookDetails(bookData);

          const updatedQuantities = {};
          cartItemFromResponse.forEach((item) => {
            updatedQuantities[item.book.id] = item.quantity;
          });
          setQuantities(updatedQuantities);
        })
        .catch((error) => {
          //alert('Error fetching cart items. Please try again.');
        });
    };

    return (
     <div className="cart-page-container">
        <div className="header">
            <h1 className="bookstore-heading" data-testid="bookstore-heading">Online Book Store</h1>
             <button className="logout-btn" >Logout</button>
        </div>
        <h2>My Cart</h2>
        <div className="cart-items-list">
            {cartItems.length > 0 ? (
               cartItems.map((item) => (
                 <div key={item.book.id} className="cart-item">
                   <div className="item-details">
                     <h3>{item.book.title}</h3>
                     <p>Author: {item.book.author}</p>
                     <p>Price: €{item.book.price.toFixed(2)}</p>
                   </div>
                 </div>
               ))
             ) : (
               <p>Your cart is empty.</p>
             )}
           </div>
         </div>
       );
     };

     export default ShoppingCart;
