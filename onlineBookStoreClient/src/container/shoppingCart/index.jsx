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
  const [error, setError] = useState(null);

useEffect(() => {
    fetchCartItems();
  }, []);
  const fetchCartItems = () => {

      axios
        .get(getHostName()+API.fetchCart, {
          headers: {
            Authorization: `Basic ${btoa(username + ':' + password)}`,
          },
        })
        .then((response) => {
          setCartItems(response.data);
          handleCartItemResponse(response.data);
        })
        .catch((error) => {
        setError("Error fetching cart data. Please try again.");
        });
    };

const handleCartItemResponse = (cartItemFromResponse) => {
    setResponseInBookDetail(cartItemFromResponse);
    setUpdateQuantities(cartItemFromResponse);
  }

  const setResponseInBookDetail = (cartItemFromResponse) => {
     const bookData = cartItemFromResponse.map(item => ({ bookId: item.book.id, quantity: item.quantity}));
     setBookDetails(bookData);
  }

  const setUpdateQuantities = (cartItemFromResponse) => {
     const updatedQuantities = {};
     cartItemFromResponse.forEach((item) => {updatedQuantities[item.book.id] = item.quantity;});
     setQuantities(updatedQuantities);
    }

  const incrementQuantity = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    handleQuantityChange(bookId, newQuantity);
  };

const handleCartItemSet = (bookId, quantity) => {
    setCartItems((prevItems) =>
          prevItems.map((item) =>item.book.id === bookId ? { ...item, quantity: parseInt(quantity) }: item)
    );
  };

const handleQuantityChange = (bookId, quantity) => {
    handleCartItemSet(bookId, quantity);

    const updatedCart = bookDetails.map(item =>
      item.bookId === bookId
        ? { ...item, quantity: parseInt(quantity) }
        : item
    );
    setBookDetails(updatedCart);

    const requestBody = {
      items: updatedCart,
      ordered: order,
    };
    axios
      .post(getHostName()+API.updateCart, requestBody, {
        headers: {
          Authorization: `Basic ${btoa(username + ':' + password)}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        setError("Failed to add book to cart.");
      });
  };

 const decrementQuantity = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
    handleQuantityChange(bookId, newQuantity);
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
                      <div className="quantity-container">
                        <label htmlFor={`quantity-${item.book.id}`} className="quantity-label" data-testid="quantity-picker"> Quantity: </label>
                          <div className="quantity-picker-cart">
                            <button className="quantity-btn" data-testid="quantity-increment"
                                onClick={() => decrementQuantity(item.book.id, item.quantity)}
                                  disabled={item.quantity <= 1}
                             > -
                            </button>
                            <input type="text" value={item.quantity} readOnly className="quantity-input" data-testid={`quantity-${item.book.id}`}/>
                            <button className="quantity-btn" onClick={() => incrementQuantity(item.book.id, item.quantity)}
                               disabled={item.quantity >= 50} > +
                            </button>
                          </div>
                          <span className="total-price" data-testid="total-price"> Total: €{(item.book.price * item.quantity).toFixed(2)}</span>
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
