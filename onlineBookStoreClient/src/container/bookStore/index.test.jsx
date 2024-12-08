import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import BookStore from "./index";
import {useNavigate } from "react-router-dom";

const books = [{ id: 1, title: 'Book 1', author: 'Author 1', price: 10 },
                  { id: 2, title: 'Book 2', author: 'Author 2', price: 15 },];
const fetchCartData = [{ bookId: 1, quantity: 1 },{ bookId: 2, quantity: 1 },];

beforeEach(() => {
   axios.get.mockResolvedValueOnce({ data: books });
   axios.get.mockResolvedValueOnce({ data: fetchCartData });
  });

afterEach(() => {
  jest.clearAllMocks();
  axios.get.mockClear();
  axios.post.mockClear();
})
jest.mock("axios");

test('Fetch All Available Books and Displays it in the Online Book Store Screen', () => {

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore /></Router>);

    const bookStoreTitle = screen.getByTestId('bookstore-heading');
    expect(bookStoreTitle).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/books', {
          headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
    });
})

test('Displays Online BookStore Heading , Cart in the screen', () => {

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

test('Quantity Picker is displayed and user can select the quantity', async() => {

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore/></Router>
    );

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/books', {
          headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
    });
        await waitFor(() => {
              books.forEach((book) => {
                expect(screen.getByText(book.title)).toBeInTheDocument();
                expect(screen.getByText(`Author: ${book.author}`)).toBeInTheDocument();
                expect(screen.getByText(`Price: €${book.price}`)).toBeInTheDocument();
              });
        });

    const select = screen.getByTestId('quantity-picker-1');
    fireEvent.change(select, { target: { value: '3' } });
    expect(select.value).toBe('3');
})

test("User Select the quantity and add item to the cart",  async() => {

    axios.post.mockResolvedValue({data: {success: true,message: "Cart updated successfully",
        updatedCart: [{ bookId: 1, quantity: 2 },{ bookId: 3, quantity: 1 },]}
    });

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore/></Router>);

    await waitFor(() => {
            books.forEach((book) => {expect(screen.getByText(book.title)).toBeInTheDocument();});
    });

    const select = screen.getByTestId('quantity-picker-1');
    fireEvent.change(select, { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('add-to-cart-1'));

    await waitFor(() => {
        books.forEach((book) => {expect(select.value).toBe('3');});
        });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/cart/updateCart',{
                  items: [{ bookId: 1, quantity: 3 }],
                  ordered: false,},{
                    headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
                    }
    );
  });

test("The count of added items should be displayed in the cart",  async() => {

    axios.post.mockResolvedValue({data: {success: true,message: "Cart updated successfully",
        updatedCart: [{ bookId: 1, quantity: 2 },{ bookId: 3, quantity: 1 },]}
    });

    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore/></Router>);

    await waitFor(() => {
            books.forEach((book) => {expect(screen.getByText(book.title)).toBeInTheDocument();});
    });

    const select = screen.getByTestId('quantity-picker-1');
    fireEvent.change(select, { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('add-to-cart-1'));

    await waitFor(() => {
        books.forEach((book) => {expect(select.value).toBe('3');});
        });
     const cartValue = screen.getByTestId('cart-button');
     expect(cartValue).toBeInTheDocument();
     expect(cartValue).toHaveTextContent('Cart (3)');;
  });

test('Fetch The Cart Data Of The User', async() => {


    render(<Router initialEntries={["/books", { state: { username: "username", password: "abc" } }]}>
            <BookStore /></Router>);

    await waitFor(() => {
        const bookStoreTitle = screen.getByTestId('bookstore-heading');
        expect(bookStoreTitle).toBeInTheDocument();
        const cartValue = screen.getByTestId('cart-button');
        expect(cartValue).toBeInTheDocument();
      });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/cart', {
          headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
    });
})


