import React from "react";
import {MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderSummary from "./index";

test('Fetch The Cart Data Of The User and Display it in the cart page', () => {

const cartItems = [{id: 1,book: {id: 123,title: 'Sample Book',author: 'Sample Author',price: 20.0},quantity: 5}];
render( <MemoryRouter initialEntries={[{ pathname: '/orderSummary', state: { cartItems, username: 'username', password: 'abc' } }]}>
      <Routes> <Route path="/orderSummary" element={<OrderSummary />} /></Routes></MemoryRouter>);

   expect(screen.getByTestId('heading')).toBeInTheDocument();
   expect(screen.getByText('Order Placed Successfully')).toBeInTheDocument();
   expect(screen.getByTestId('quantity-123')).toBeInTheDocument();
   expect(screen.getByText('Grand Total: €100.00')).toBeInTheDocument();
});
