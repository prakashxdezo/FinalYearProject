import React from "react";
import { Route, Routes } from "react-router";
import SellerTable from "../admin/Seller/SellerTable";
import Coupon from "../admin/Coupon/Coupon";
import CouponForm from "../admin/Coupon/CouponForm";
import GridTable from "../admin/HomePage/GridTable";
import ClothesTable from "../admin/HomePage/ClothesTable";
import ShopByCategory from "../admin/HomePage/ShopByCategory";
import Deal from "../admin/Deal/Deal";
import AdminHome from "../admin/Home/AdminHome";
import TopSellers from "../admin/Sellers/TopSellers";
import TopProducts from "../admin/Products/TopProducts";
import CommissionTable from "../admin/Commissions/CommissionTable";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/sellers" element={<SellerTable />} />
      <Route path="/coupon" element={<Coupon />} />
      <Route path="/add-coupon" element={<CouponForm />} />
      <Route path="/home-grid" element={<GridTable />} />
      <Route path="/clothes-category" element={<ClothesTable />} />
      <Route path="/shop-by-category" element={<ShopByCategory />} />
      <Route path="/deals" element={<Deal />} />
      <Route path="/top-sellers" element={<TopSellers />} />
      <Route path="/top-products" element={<TopProducts />} />
      <Route path="/commissions" element={<CommissionTable />} />
    </Routes>
  );
};

export default AdminRoutes;
