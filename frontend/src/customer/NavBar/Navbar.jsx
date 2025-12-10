import {
  Box,
  Button,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Badge,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { mainCategory } from "../../data/Category/mainCategory";
import CategorySheet from "./CategorySheet";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../Redux Toolkit/store";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";



const Navbar = () => {
  const { user } = useAppSelector((store) => store.user) ?? {};
  const { wishlist } = useAppSelector((store) => store.wishlist);
  const wishlistCount = wishlist?.products?.length || 0;
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("action-figures");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useAppSelector((store) => store.cart);
  const cartCount = cart?.cartItems?.length || 0;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <Box
      className="sticky top-0 left-0 right-0 z-50"
      sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
    >
      {/* Top bar */}
      <div
        style={{ background: "#1a1a2e" }}
        className="px-5 lg:px-16 h-[64px] flex items-center justify-between gap-4"
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          {!isLarge && (
            <IconButton
              sx={{ color: "white" }}
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <span className="nav-logo text-2xl text-white tracking-wider">
            TOY<span style={{ color: "#e85d04" }}>VERSE</span>
          </span>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl hidden sm:flex items-center"
          style={{
            background: "white",
            borderRadius: "4px",
            overflow: "hidden",
            border: "2px solid #e85d04",
          }}
        >
          <InputBase
            placeholder="Search for toys, games, figures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, px: 2, fontSize: 14 }}
          />
          <button
            type="submit"
            style={{
              background: "#e85d04",
              border: "none",
              padding: "10px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon sx={{ color: "white", fontSize: 20 }} />
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user?.fullName ? (
            <Button
              onClick={() => navigate("/account")}
              sx={{ color: "white", textTransform: "none", gap: 1 }}
            >
              <Avatar
                src={user?.profilePicture || ""}
                sx={{ width: 28, height: 28, bgcolor: "#6366f1", fontSize: 13 }}
              >
                {!user?.profilePicture &&
                  user?.fullName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <span className="hidden lg:block text-sm">{user?.fullName}</span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: 13,
                gap: 0.5,
              }}
              startIcon={<AccountCircleIcon fontSize="small" />}
            >
              <span className="hidden sm:block">Sign In</span>
            </Button>
          )}

          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate("/account/wishlist")}
          >
            <Badge badgeContent={wishlistCount || 0} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={() => navigate("/cart")} sx={{ color: "white" }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Button
            onClick={() => navigate("/become-seller")}
            variant="contained"
            startIcon={<StorefrontIcon fontSize="small" />}
            sx={{
              background: "#e85d04",
              color: "white",
              fontSize: 12,
              px: 2,
              py: 0.8,
              display: { xs: "none", md: "flex" },
              "&:hover": { background: "#c94e00" },
            }}
          >
            Sell
          </Button>
        </div>
      </div>

      {/* Category nav bar */}
      <div
        style={{ background: "#16213e" }}
        className="px-5 lg:px-16 h-[42px] flex items-center gap-0 overflow-x-auto"
      >
        {mainCategory.map((item) => (
          <div
            key={item.categoryid}
            onMouseLeave={() => setShowSheet(false)}
            onMouseEnter={() => {
              setShowSheet(true);
              setSelectedCategory(item.categoryid);
            }}
            className="flex items-center gap-1 cursor-pointer h-[42px] px-4 border-b-2 border-transparent hover:border-orange-500 transition-all whitespace-nowrap"
            style={{ color: "#cbd5e1" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#cbd5e1")}
          >
            <span className="text-sm font-semibold">{item.name}</span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </div>
        ))}
        <div
          className="flex items-center gap-1 cursor-pointer h-[42px] px-4 border-b-2 border-transparent hover:border-orange-500 transition-all whitespace-nowrap ml-auto"
          style={{ color: "#94a3b8" }}
          onClick={() => navigate("/products/all")}
        >
          <span className="text-sm">All Toys →</span>
        </div>
      </div>

      {/* Dropdown sheet */}
      {showSheet && (
        <div
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="absolute left-0 right-0"
          style={{ top: "106px" }}
        >
          <CategorySheet
            selectedCategory={selectedCategory}
            setShowSheet={setShowSheet}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "#1a1a2e",
            color: "white",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="nav-logo text-xl text-white tracking-wider">
            TOY<span style={{ color: "#e85d04" }}>VERSE</span>
          </span>
          <IconButton
            sx={{ color: "white" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Mobile Search */}
        <div className="px-4 py-3">
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileMenuOpen(false);
            }}
            style={{
              background: "white",
              borderRadius: 4,
              overflow: "hidden",
              border: "2px solid #e85d04",
              display: "flex",
            }}
          >
            <InputBase
              placeholder="Search toys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, px: 2, fontSize: 14 }}
            />
            <button
              type="submit"
              style={{
                background: "#e85d04",
                border: "none",
                padding: "8px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon sx={{ color: "white", fontSize: 18 }} />
            </button>
          </form>
        </div>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Categories */}
        <div className="py-2 flex-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs text-slate-400 font-bold tracking-widest">
            CATEGORIES
          </p>
          {mainCategory.map((item) => (
            <div
              key={item.categoryid}
              onClick={() => {
                navigate(`/products/${item.categoryid}`);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span className="text-sm font-semibold text-slate-200">
                {item.name}
              </span>
              <ArrowForwardIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            </div>
          ))}
        </div>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Actions */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <Button
            fullWidth
            onClick={() => {
              navigate("/become-seller");
              setMobileMenuOpen(false);
            }}
            variant="contained"
            startIcon={<StorefrontIcon />}
            sx={{
              background: "#e85d04",
              color: "white",
              fontWeight: 700,
              "&:hover": { background: "#c94e00" },
            }}
          >
            Start Selling
          </Button>

          {!user?.fullName ? (
            <Button
              fullWidth
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              variant="outlined"
              startIcon={<AccountCircleIcon />}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Sign In
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={() => {
                navigate("/account");
                setMobileMenuOpen(false);
              }}
              variant="outlined"
              startIcon={
                <Avatar
                  src={user?.profilePicture || ""}
                  sx={{
                    width: 22,
                    height: 22,
                    bgcolor: "#6366f1",
                    fontSize: 11,
                  }}
                >
                  {!user?.profilePicture &&
                    user?.fullName?.charAt(0)?.toUpperCase()}
                </Avatar>
              }
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            >
              {user?.fullName}
            </Button>
          )}

          <div className="flex gap-2 mt-1">
            <Button
              fullWidth
              onClick={() => {
                navigate("/account/wishlist");
                setMobileMenuOpen(false);
              }}
              startIcon={<FavoriteIcon />}
              sx={{
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 12,
                "&:hover": {
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                },
              }}
            >
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Button>
            <Button
              fullWidth
              onClick={() => {
                navigate("/cart");
                setMobileMenuOpen(false);
              }}
              startIcon={<ShoppingCartIcon />}
              sx={{
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 12,
                "&:hover": {
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                },
              }}
            >
              Cart
            </Button>
          </div>
        </div>
      </Drawer>
    </Box>
  );
};

export default Navbar;
