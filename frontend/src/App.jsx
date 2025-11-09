import { ThemeProvider } from "@emotion/react";
import Button from "@mui/material/Button";
import { customTheme } from "./Theme/customTheme";
import Home from "./customer/components/pages/Home/Home";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Products from "./customer/components/pages/Product/Products";
import Footer from "./customer/Footer/Footer";
import ProductDetails from "./customer/components/pages/Product/ProductDetails/ProductDetails";
import Cart from "./customer/components/pages/Cart/Cart";
import Checkout from "./customer/components/pages/Checkout/Checkout";
import NavBar from "./customer/NavBar/Navbar";
import Profile from "./customer/components/pages/Order/Profile";
import { Route, Routes } from "react-router";
import SellerDashboard from "./seller/SellerDashboard/SellerDashboard";
import BecomeSeller from "./Auth/BecomeSeller/BecomeSeller";
import CustomerRoutes from "./routes/CustomerRoutes";
import Auth from "./Auth/Auth";
import Dashboard from "./admin/Dashboard/Dashboard";
import { useAppDispatch, useAppSelector } from "./Redux Toolkit/store";
import { useEffect } from "react";
import { fetchUserProfile } from "./Redux Toolkit/features/customer/userSlice";
import { fetchSellerProfile } from "./Redux Toolkit/features/seller/sellerSlice";
import { fetchHomeCategories, createHomeCategories } from "./Redux Toolkit/features/customer/HomeCategorySlice";
import { homeCategories } from "./data/homeCategories";
import { fetchWishlist } from "./Redux Toolkit/features/customer/wishlistSlice";



function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);


  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt || auth.jwt) {
      dispatch(fetchUserProfile(jwt));
      dispatch(fetchSellerProfile(jwt));
      dispatch(fetchWishlist(jwt));
    }
  }, [auth.jwt, dispatch]);

  useEffect(() => {
    dispatch(fetchHomeCategories());
     dispatch(createHomeCategories(homeCategories));
  }, [dispatch]);
    
  return (
    <ThemeProvider theme={customTheme}>
      <Routes>
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/seller/*" element={<SellerDashboard />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/login/*" element={<Auth />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>    
    </ThemeProvider>
  );
}

export default App;
