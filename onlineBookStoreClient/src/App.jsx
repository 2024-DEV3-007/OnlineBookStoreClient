import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./container/login/index";
import BookStore from "./container/bookStore/index";
import ShoppingCart from "./container/shoppingCart/index";
import OrderSummary from "./container/orderSummary/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/books" element={<BookStore />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orderSummary" element={<OrderSummary />} />
      </Routes>
    </Router>
  );
}

export default App;