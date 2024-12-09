import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import ShoppingCart from "./index";

const fetchCartData = [{id: 1,book: {id: 123,title: 'Sample Book',author: 'Sample Author',price: 20.0},quantity: 5}];

beforeEach(() => {
   axios.get.mockResolvedValueOnce({ data: fetchCartData });
  });

afterEach(() => {
  jest.clearAllMocks();
  axios.get.mockClear();
})
jest.mock("axios");

test('Fetch The Cart Data Of The User and Display it in the cart page', async() => {

    render(<Router initialEntries={["/cart", { state: { username: "username", password: "abc" } }]}>
            <ShoppingCart /></Router>);
    await waitFor(() => {
        const bookStoreTitle = screen.getByTestId('bookstore-heading');
        expect(bookStoreTitle).toBeInTheDocument();
      });
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/cart', {
          headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
    });
})

test('User can increment the quantity in the cart page', async() => {

    axios.post.mockResolvedValue({data: {success: true,message: "Cart updated successfully",
        updatedCart: [{ bookId: 1, quantity: 2 },{ bookId: 3, quantity: 1 },]}
    });

    render(<Router initialEntries={["/cart", { state: { username: "username", password: "abc" } }]}>
            <ShoppingCart /></Router>);

    await waitFor(() => {
        const bookStoreTitle = screen.getByTestId('bookstore-heading');
        expect(bookStoreTitle).toBeInTheDocument();
      });

   expect(screen.getByTestId('quantity-picker')).toBeInTheDocument();
   const value = screen.getByTestId('quantity-123');
   expect(screen.getByTestId('quantity-123').value).toBe('5');
   const incrementButton = screen.getByText('+');
   fireEvent.click(incrementButton);

   await waitFor(() => {
          expect(screen.getByTestId('quantity-123').value).toBe('6');
    });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/cart/updateCart',{
                  items: [{ bookId: 123, quantity: 6 }],
                  ordered: false,},{
                      headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
                  }
    );
})

test('User can decrement the quantity in the cart page', async() => {

    axios.post.mockResolvedValue({data: {success: true,message: "Cart updated successfully",
        updatedCart: [{ bookId: 1, quantity: 2 },{ bookId: 3, quantity: 1 },]}
    });

    render(<Router initialEntries={["/cart", { state: { username: "username", password: "abc" } }]}>
            <ShoppingCart /></Router>);

    await waitFor(() => {
        const bookStoreTitle = screen.getByTestId('bookstore-heading');
        expect(bookStoreTitle).toBeInTheDocument();
      });

   expect(screen.getByTestId('quantity-picker')).toBeInTheDocument();
   const value = screen.getByTestId('quantity-123');
   expect(screen.getByTestId('quantity-123').value).toBe('5');
   const decrementButton = screen.getByText('-');
   fireEvent.click(decrementButton);

   await waitFor(() => {
          expect(screen.getByTestId('quantity-123').value).toBe('4');
    });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/cart/updateCart',{
                  items: [{ bookId: 123, quantity: 4 }],
                  ordered: false,},{
                      headers: { Authorization: `Basic dW5kZWZpbmVkOnVuZGVmaW5lZA==` },
                  }
    );
})

