import { Divider, Avatar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentIcon from "@mui/icons-material/Payment";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { performLogout } from "../../Redux Toolkit/features/Auth/AuthSlice";

const menu = [
  { name: "Dashboard", path: "/seller", icon: <DashboardIcon fontSize="small" /> },
  { name: "Orders", path: "/seller/orders", icon: <ShoppingBagIcon fontSize="small" /> },
  { name: "Products", path: "/seller/products", icon: <InventoryIcon fontSize="small" /> },
  { name: "Add Product", path: "/seller/add-product", icon: <AddIcon fontSize="small" /> },
  { name: "Payment", path: "/seller/payment", icon: <PaymentIcon fontSize="small" /> },
  { name: "Transaction", path: "/seller/transaction", icon: <ReceiptIcon fontSize="small" /> },
];

const menu2 = [
  { name: "Account", path: "/seller/account", icon: <AccountBoxIcon fontSize="small" /> },
  { name: "Logout", path: "/", icon: <LogoutIcon fontSize="small" /> },
];

const SellerDrawerList = ({ toggleDrawer }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sellerAuth = useAppSelector((store) => store.sellerAuth);

  const handleLogout = () => {
    dispatch(performLogout());
  };

  const handleClick = (item) => {
    if (item.name === "Logout") handleLogout();
    navigate(item.path);
    if (toggleDrawer) toggleDrawer(false)();
  };

  const NavItem = ({ item }) => {
    const active = location.pathname === item.path;
    const isLogout = item.name === "Logout";
    return (
      <button
        onClick={() => handleClick(item)}
        className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium"
        style={{
          background: active ? "rgba(20,184,166,0.2)" : "transparent",
          color: isLogout ? "#fca5a5" : active ? "#fff" : "#99f6e4",
          borderLeft: active ? "3px solid #14b8a6" : "3px solid transparent",
        }}
      >
        <span style={{ color: isLogout ? "#f87171" : active ? "#5eead4" : "#2dd4bf" }}>
          {item.icon}
        </span>
        {item.name}
      </button>
    );
  };

  return (
    <div className="h-full">
      <div
        className="flex flex-col justify-between h-full border-r"
        style={{ width: 260, background: "linear-gradient(180deg,#042f2e 0%,#134e4a 100%)", color: "#fff" }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-teal-800">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: "#14b8a6" }}>
              T
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">ToyVerse</p>
              <p className="text-teal-300 text-xs">Seller Portal</p>
            </div>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {menu.map((item) => <NavItem key={item.path} item={item} />)}
          </nav>
        </div>

        {/* Bottom */}
        <div className="px-3 pb-5">
          <Divider sx={{ borderColor: "rgba(20,184,166,0.3)", mb: 2 }} />
          {sellerAuth?.seller?.name && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#14b8a6", fontSize: 13 }}>
                {sellerAuth.seller.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium leading-tight">{sellerAuth.seller.name}</p>
                <p className="text-teal-300 text-xs">Seller</p>
              </div>
            </div>
          )}
          {menu2.map((item) => <NavItem key={item.path} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default SellerDrawerList;
