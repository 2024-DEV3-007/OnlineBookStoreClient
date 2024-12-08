import React, { useState, useEffect } from "react";
import axios from "axios";
import {useLocation, useNavigate } from "react-router-dom";
import "./index.css";

 const BookStore = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { username, password } = location.state || {};
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cartItem, setCart] = useState([]);
  const [addedBooks, setAddedBooks] = useState(new Set());
  const [order, setOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);

  useEffect(() => {
    fetchBooks();
    fetchCartData();
  }, []);

const fetchBooks = () => {
    setError(null);
    axios
      .get("http://localhost:8080/api/books", {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setError("Error fetching books. Please try again.");
      });
  };

const fetchCartData = () => {
    setError(null);
    axios
      .get("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      .then((response) => {
        handleCartItemResponse(response.data);
      })
      .catch((error) => {
        setError("Error fetching cart data. Please try again.");
      });
  };

const handleCartItemResponse = (cartItemFromResponse) => {
    setTheItemInCart(cartItemFromResponse);
    setTheAddedBookSet(cartItemFromResponse);
    setUpdateQuantities(cartItemFromResponse);
  }

const setTheItemInCart = (cartItemFromResponse) => {
   const cartData = cartItemFromResponse.map(item => ({bookId: item.book.id,quantity: item.quantity}));
   setCart(cartData);
  };

const setTheAddedBookSet = (cartItemFromResponse) => {
  const addedBooksSet = new Set(cartItemFromResponse.map(item => item.book.id));
  setAddedBooks(addedBooksSet);
  };

const setUpdateQuantities = (cartItemFromResponse) => {
 const updatedQuantities = {};
 cartItemFromResponse.forEach((item) => {updatedQuantities[item.book.id] = item.quantity;});
 setQuantities(updatedQuantities);
};

const handleQuantityChange = (bookId, value) => {
    setQuantities((prev) => ({ ...prev, [bookId]: parseInt(value, 10) }));
  };

  const handleAddToCart = (book) => {
      const cartItemsToAdd = { bookId: book.id, quantity: quantities[book.id] || 1 };

    const updatedCart = cartItem.some(item => item.bookId === cartItemsToAdd.bookId)
    ? cartItem.map(item =>
        item.bookId === cartItemsToAdd.bookId
          ? { ...item, quantity: cartItemsToAdd.quantity }
          : item
      ) : [...cartItem, cartItemsToAdd];
      setCart(updatedCart);
      const addedBooksSet = new Set(updatedCart.map(item => item.bookId));
      setAddedBooks(addedBooksSet);

      const requestBody = {
        items: updatedCart,
        ordered: order,
      };

      axios
        .post("http://localhost:8080/api/cart/updateCart", requestBody, {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setAddedBooks((prev) => new Set(prev).add(book.id));
        })
        .catch((error) => {
          alert("Failed to add book to cart.");
        });
    };

const getTotalItems = () => {
  return cartItem.reduce((total, item) => total + item.quantity, 0);
};

 const handleViewCart = () => {
    navigate("/cart", {
      state: {
        username: username,
        password: password,
      },
    });
  };

const handleLogout = () => {
   setTimeout(() => {
            window.location.reload();
          }, 1000);
    navigate("/");
  };
  return (
    <div className="bookscreen-container">
      <div className="header">
        <h1 className="bookstore-heading" data-testid="bookstore-heading">Online Book Store</h1>
        <button className="logout-btn" data-testid="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="user-greeting-container">
        <span className="username" data-testid="user-greeting">Hi,{username}</span>
          <button className="cart-btn" data-testid="cart-button" onClick={handleViewCart}>
              Cart {getTotalItems() > 0 && <span>({getTotalItems()})</span>}
          </button>
      </div>
      <div className="book-list">
              {books.map((book) => (
                <div key={book.id} className="book-item" data-testid="book-item">
                  <h3 data-testid="book-title">{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Price: €{book.price}</p>
                  <div className="book-actions">
                  <select className="quantity-picker" data-testid={`quantity-picker-${book.id}`}
                        value={quantities[book.id] || 1}
                        onChange={(e) => handleQuantityChange(book.id, e.target.value)}>
                        <option value="" disabled> </option>
                        {[...Array(50).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}> {i + 1} </option>
                        ))}
                  </select>
                  <button onClick={() => handleAddToCart(book)} className="add-to-cart-btn" data-testid={`add-to-cart-${book.id}`}>
                        Add to Cart</button>
                   </div>
                </div>
              ))}
            </div>
    </div>
  );
};

export default BookStore;