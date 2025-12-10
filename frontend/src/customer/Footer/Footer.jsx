import React from "react";
import { useNavigate } from "react-router";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Divider, IconButton } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import CachedIcon from "@mui/icons-material/Cached";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const trustBadges = [
  { icon: <LocalShippingIcon />, label: "Free Delivery", sub: "Orders above NRs 1500" },
  { icon: <SecurityIcon />, label: "Safe Payments", sub: "100% secure checkout" },
  { icon: <CachedIcon />, label: "Easy Returns", sub: "30-day return policy" },
  { icon: <HeadsetMicIcon />, label: "24/7 Support", sub: "Always here for you" },
];

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ background: "#0d0d1a" }} className="text-gray-400 mt-0">

      {/* Trust badges */}
      <div style={{ background: "#16213e", borderBottom: "1px solid #1e2a45" }}>
        <div className="lg:px-16 px-5 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <div style={{ color: "#e85d04" }}>{b.icon}</div>
              <div>
                <p className="text-white text-sm font-bold">{b.label}</p>
                <p className="text-xs text-slate-400">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="lg:px-16 px-5 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <h1 className="nav-logo text-3xl text-white">
            TOY<span style={{ color: "#e85d04" }}>VERSE</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Nepal's favourite multi-vendor toy marketplace. Action figures, board games,
            RC vehicles, educational toys — all in one place.
          </p>
          <div className="flex gap-1">
            {[FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon].map((Icon, i) => (
              <IconButton key={i} sx={{ color: "#4b5563", "&:hover": { color: "#e85d04" } }} size="small">
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="space-y-4">
          <h2 className="text-white font-black text-xs uppercase tracking-widest">Shop</h2>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Action Figures", path: "/products/action-figures" },
              { label: "Educational Toys", path: "/products/educational-toys" },
              { label: "Board Games", path: "/products/board-games" },
              { label: "Outdoor Toys", path: "/products/outdoor-toys" },
              { label: "Today's Deals", path: "/products/all" },
            ].map((item) => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h2 className="text-white font-black text-xs uppercase tracking-widest">Support</h2>
          <ul className="space-y-2 text-sm">
            {[
              { label: "My Orders", path: "/account/orders" },
              { label: "Return Policy", path: "/return-policy" },
              { label: "Shipping Policy", path: "/shipping-policy" },
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms & Conditions", path: "/terms" },
            ].map((item) => (
              <li
                key={item.label}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-white font-black text-xs uppercase tracking-widest">Contact Us</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <LocationOnIcon fontSize="small" style={{ color: "#e85d04" }} />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon fontSize="small" style={{ color: "#e85d04" }} />
              <span>+977 9800000000</span>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon fontSize="small" style={{ color: "#e85d04" }} />
              <span>support@toyverse.com.np</span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
              onClick={() => navigate("/become-seller")}
            >
              <StorefrontIcon fontSize="small" style={{ color: "#e85d04" }} />
              <span>Sell on ToyVerse</span>
            </div>
          </div>
        </div>
      </div>

      <Divider sx={{ borderColor: "#1e2a45" }} />

      <div className="lg:px-16 px-5 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
        <p>© 2026 ToyVerse Nepal Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
