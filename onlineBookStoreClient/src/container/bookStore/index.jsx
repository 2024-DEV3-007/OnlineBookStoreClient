import React, { useState, useEffect } from "react";
import axios from "axios";
import {useLocation } from "react-router-dom";
import "./index.css";

 const BookStore = () => {

  const location = useLocation();
  const { username, password } = location.state || {};
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);

  useEffect(() => {
    fetchBooks();
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

  return (
    <div className="bookscreen-container">
      <div className="header">
        <h1 className="bookstore-heading" data-testid="bookstore-heading">Online Book Store</h1>
        <button className="logout-btn" data-testid="logout-button">Logout</button>
      </div>
      <div className="user-greeting-container">
        <span className="username" data-testid="user-greeting">Hi,{username}</span>
              <button className="cart-btn" data-testid="cart-button"> Cart  </button>
      </div>
      <div className="book-list">
              {books.map((book) => (
                <div key={book.id} className="book-item" data-testid="book-item">
                  <h3>{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Price: €{book.price}</p>
                </div>
              ))}
            </div>
    </div>
  );
};

export default BookStore;