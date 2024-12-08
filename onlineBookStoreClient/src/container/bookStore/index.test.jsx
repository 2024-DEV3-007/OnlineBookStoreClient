import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import BookStore from "./index";

afterEach(() => {
  jest.clearAllMocks();
  axios.get.mockClear();
})
jest.mock("axios");

test('Fetch All Available Books and Displays it in the Online Book Store Screen', () => {

    const mockBooksData = [{ id: 1, title: 'Book 1' },{ id: 2, title: 'Book 2' },];
    axios.get.mockResolvedValueOnce({ data: mockBooksData });

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore /></Router>);

    const bookStoreTitle = screen.getByTestId('bookstore-heading');
    expect(bookStoreTitle).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/books', {
          headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
    });
})

test('Displays Online BookStore Heading , Cart in the screen', () => {

    const mockBooksData = [{ id: 1, title: 'Book 1' },{ id: 2, title: 'Book 2' },];
    axios.get.mockResolvedValueOnce({ data: mockBooksData });

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore /></Router>
    );

    const bookStoreTitle = screen.getByTestId('bookstore-heading');
    expect(bookStoreTitle).toBeInTheDocument();
    const userGreeting = screen.getByTestId('user-greeting');
    expect(userGreeting).toBeInTheDocument();
    const cartButton = screen.getByTestId('cart-button');
    expect(cartButton).toBeInTheDocument();
    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
})
