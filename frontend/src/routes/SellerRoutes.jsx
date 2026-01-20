import React from "react";
import { Route, Routes } from "react-router";
import Products from "../seller/Products/Products";
import AddProducts from "../seller/Products/AddProducts";
import Orders from "../seller/Orders/Orders";
import Account from "../seller/Account/Account";
import Payment from "../seller/Payment/Payment";
import Transaction from "../seller/Transaction/Transaction";
import Dashboard from "../seller/SellerDashboard/Dashboard"; 
import EditProduct from "../seller/Products/EditProduct";

const SellerRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />{" "}
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProducts />} />
        <Route path="/product/edit/:productId" element={<EditProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </div>
  );
};

export default SellerRoutes;
