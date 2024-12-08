import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./index";

test('Displays Login header in the Login page', () => {

    render(<Login />);
    const titleElement = screen.getByText(/Login/i);
    expect(titleElement).toBeInTheDocument();
})