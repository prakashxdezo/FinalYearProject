import { Divider, Avatar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../Redux Toolkit/store";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    name: "Sellers",
    path: "/admin/sellers",
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    name: "Top Sellers",
    path: "/admin/top-sellers",
    icon: <TrendingUpIcon fontSize="small" />,
  },
  {
    name: "Top Products",
    path: "/admin/top-products",
    icon: <InventoryIcon fontSize="small" />,
  },
  {
    name: "Commissions",
    path: "/admin/commissions",
    icon: <AccountBalanceIcon fontSize="small" />,
  },
  {
    name: "Coupons",
    path: "/admin/coupon",
    icon: <IntegrationInstructionsIcon fontSize="small" />,
  },
  {
    name: "Add Coupon",
    path: "/admin/add-coupon",
    icon: <AddIcon fontSize="small" />,
  },
  {
    name: "Home Page",
    path: "/admin/home-grid",
    icon: <HomeIcon fontSize="small" />,
  },
  {
    name: "Toy Categories",
    path: "/admin/clothes-category",
    icon: <CategoryIcon fontSize="small" />,
  },
  {
    name: "Shop By Category",
    path: "/admin/shop-by-category",
    icon: <StoreIcon fontSize="small" />,
  },
  {
    name: "Deals",
    path: "/admin/deals",
    icon: <LocalOfferIcon fontSize="small" />,
  },
];

const AdminDrawerList = ({ toggleDrawer }) => {
  const user = useAppSelector((store) => store.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.name === "Logout") {
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");
    }
    navigate(item.path);
    if (toggleDrawer) toggleDrawer(false)();
  };

  return (
    <div className="h-full">
      <div
        className="flex flex-col justify-between h-full border-r"
        style={{
          width: 260,
          background: "linear-gradient(180deg,#1e1b4b 0%,#312e81 100%)",
          color: "#fff",
        }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-700">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ background: "#6366f1" }}
            >
              T
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">
                ToyVerse
              </p>
              <p className="text-indigo-300 text-xs">Admin Panel</p>
            </div>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {menu.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleClick(item)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium"
                  style={{
                    background: active ? "rgba(99,102,241,0.3)" : "transparent",
                    color: active ? "#fff" : "#c7d2fe",
                    borderLeft: active
                      ? "3px solid #818cf8"
                      : "3px solid transparent",
                  }}
                >
                  <span style={{ color: active ? "#a5b4fc" : "#818cf8" }}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-1">
          <Divider sx={{ borderColor: "rgba(99,102,241,0.3)", mb: 2 }} />
          {user?.user?.fullName && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: "#6366f1", fontSize: 13 }}
              >
                {user.user.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium leading-tight">
                  {user.user.fullName}
                </p>
                <p className="text-indigo-300 text-xs">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={() => handleClick({ name: "Logout", path: "/" })}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{ color: "#fca5a5" }}
          >
            <LogoutIcon fontSize="small" style={{ color: "#f87171" }} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDrawerList;
