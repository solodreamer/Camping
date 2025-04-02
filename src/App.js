// import logo from './logo.svg';
// import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import HomePage from "./pages/homePage";
import PrivacyPolicy from "./pages/privacyPolicy";
import TermService from "./pages/termService";
import SearchPage from "./pages/searchPage";
import CampDetail from "./pages/campDetail";
import CheckoutConfirm from "./pages/checkout-confirm";
import CheckoutPayment from "./pages/checkout-payment";
import PaymentResult from "./pages/paymentResult";

function App() {

  return (
    <div className="App">
      {/* 設定路由路徑 */}
      <Routes>
        <Route path="" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/privacyPolicy" element={<PrivacyPolicy />}></Route>
        <Route path="/termService" element={<TermService />}></Route>
        <Route path="/searchPage" element={<SearchPage />}></Route>
        <Route path="/campDetail/:id" element={<CampDetail />}></Route>
        <Route path="/checkout-confirm" element={<CheckoutConfirm />}></Route>
        <Route path="/checkout-payment" element={<CheckoutPayment />}></Route>
        <Route path="/payment-result" element={<PaymentResult />}></Route>
      </Routes>
    </div>
  );
}

export default App;
