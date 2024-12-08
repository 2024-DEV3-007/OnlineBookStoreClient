import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./container/login/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;