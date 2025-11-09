import {
    configureStore,
    combineReducers
} from "@reduxjs/toolkit";

import {useDispatch, useSelector} from "react-redux";
import authReducer from "./features/Auth/AuthSlice";
import userReducer from "./features/customer/userSlice";
import productReducer from "./features/customer/productSlice";
import orderReducer from "./features/customer/orderSlice";
import cartReducer from "./features/customer/cartSlice";
import couponReducer from "./features/customer/couponSlice";
import homeCategoryReducer from "./features/customer/HomeCategorySlice";
import sellerAuthReducer from "./features/seller/sellerAuthentication.js";
import sellerOrderReducer from "./features/seller/sellerOrderSlice.js";
import sellerProductReducer from "./features/seller/sellerProductSlice.js";
import sellerReducer from "./features/seller/sellerSlice.js";
import transactionReducer from "./features/seller/transactionSlice.js";
import adminSlice from "./features/Admin/AdminSlice.js";
import dealSlice from "./features/Admin/DealSlice.js";
import AdminCouponReducer from "./features/Admin/CouponSlice.js";
import addressReducer from "./features/customer/addressSlice";
import wishlistReducer from "./features/customer/wishlistSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  order: orderReducer,
  cart: cartReducer,
  coupon: couponReducer,
  homeCategory: homeCategoryReducer,
  address: addressReducer,
  wishlist: wishlistReducer,
  
  //seller reducer
  sellerAuth: sellerAuthReducer,
  sellerOrder: sellerOrderReducer,
  sellerProduct: sellerProductReducer,
  seller: sellerReducer,
  transaction: transactionReducer,

  //admin reducer
  admin: adminSlice,
  deal: dealSlice,
  adminCoupon: AdminCouponReducer,
});

const store = configureStore({
    reducer:rootReducer,
})
 

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);


export default store;