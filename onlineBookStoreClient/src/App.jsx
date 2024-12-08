import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./container/login/index";
import BookStore from "./container/bookStore/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/books" element={<BookStore />} />
      </Routes>
    </Router>
  );
}

export default App;