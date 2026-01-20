import React from "react";
import Navbar from "../customer/NavBar/Navbar";
import { Route, Routes } from "react-router";
import Home from "../customer/components/pages/Home/Home";
import Products from "../customer/components/pages/Product/Products";
import ProductDetails from "../customer/components/pages/Product/ProductDetails/ProductDetails";
import Cart from "../customer/components/pages/Cart/Cart";
import Checkout from "../customer/components/pages/Checkout/Checkout";
import Profile from "../customer/components/pages/Order/Profile";
import Footer from "../customer/Footer/Footer";
import PaymentSuccess from "../customer/components/pages/Checkout/paymentSuccess";
import EsewaSuccess from "../customer/components/pages/Checkout/EsewaSuccess";
import EsewaFailure from "../customer/components/pages/Checkout/EsewaFailure";
import FAQ from "../customer/components/pages/Static/FAQ";
import ShippingPolicy from "../customer/components/pages/Static/ShippingPolicy";
import ReturnPolicy from "../customer/components/pages/Static/ReturnPolicy";
import PrivacyPolicy from "../customer/components/pages/Static/PrivacyPolicy";
import Terms from "../customer/components/pages/Static/TermsAndConditions";
import Wishlist from "../customer/components/pages/Wishlist/Wishlist";
import SearchResults from "../customer/components/pages/Product/SearchResults";

const CustomerRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:categoryId" element={<Products />} />
        <Route
          path="/product-details/:categoryId/:name/:productId"
          element={<ProductDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/address" element={<Checkout />} />
        <Route path="/account/*" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/esewa-success" element={<EsewaSuccess />} />
        <Route path="/payment/esewa-failure" element={<EsewaFailure />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/products/search" element={<SearchResults />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default CustomerRoutes;
