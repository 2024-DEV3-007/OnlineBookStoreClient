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