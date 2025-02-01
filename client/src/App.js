import { Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Home from "./pages/home";
import Navbar from "./components/Navbar";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import SignOut from "./pages/signout";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Profile from "./pages/profile";
import OrderHistory from "./pages/orderHistory";
import OrderDetails from "./pages/orderDetails";
import MyProvider from "./MyProvider";


function App() {

  return (
    <MyProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MyProvider>
  );
}

export default App;
