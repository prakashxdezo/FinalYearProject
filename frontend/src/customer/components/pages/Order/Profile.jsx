import React from "react";
import { Divider } from "@mui/material";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { performLogout } from "../../../../Redux Toolkit/features/Auth/AuthSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import Order from "./Order";
import OrderDetails from "./OrderDetails";
import UserDetails from "../Account/UserDetails";
import Wishlist from "../Wishlist/Wishlist";

const menu = [
  { name: "Profile", path: "/account", icon: <PersonIcon fontSize="small" /> },
  { name: "Orders", path: "/account/orders", icon: <ShoppingBagIcon fontSize="small" /> },
  { name: "Wishlist", path: "/account/wishlist", icon: <FavoriteIcon fontSize="small" /> },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.user) ?? {};

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/");
  };

  return (
    <div className="px-5 lg:px-32 min-h-screen mt-10 pb-20">
      <div className="flex items-center gap-3 pb-5">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{user?.fullName || "My Account"}</h1>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-gray-50 last:border-b-0 transition-colors"
                  style={{
                    background: active ? "#eef2ff" : "#fff",
                    color: active ? "#4f46e5" : "#374151",
                    borderLeft: active ? "3px solid #4f46e5" : "3px solid transparent",
                  }}
                >
                  <span style={{ color: active ? "#4f46e5" : "#9ca3af" }}>{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-red-50"
              style={{ color: "#ef4444", borderLeft: "3px solid transparent" }}
            >
              <LogoutIcon fontSize="small" style={{ color: "#ef4444" }} />
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/orders/:orderId/item/:orderItemId" element={<OrderDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
