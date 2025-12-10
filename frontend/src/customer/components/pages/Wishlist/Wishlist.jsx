import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { fetchWishlist, removeFromWishlist } from "../../../../Redux Toolkit/features/customer/wishlistSlice";
import { addItemToCart } from "../../../../Redux Toolkit/features/customer/cartSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CircularProgress, Button } from "@mui/material";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useAppSelector((s) => s.wishlist);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) dispatch(fetchWishlist(jwt));
  }, [jwt]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist({ jwt, productId }));
  };

  const handleAddToCart = (productId) => {
    dispatch(addItemToCart({ jwt, request: { productId, quantity: 1 } }));
  };

  const products = wishlist?.products || [];

  return (
    <div className="min-h-screen px-5 lg:px-20 pt-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FavoriteIcon style={{ color: "#ef4444", fontSize: 28 }} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-sm text-gray-400">{products.length} item{products.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <CircularProgress />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FavoriteIcon style={{ color: "#d1d5db", fontSize: 72 }} />
          <h2 className="text-xl font-semibold text-gray-400 mt-4">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm mt-2">Browse products and save your favourites here.</p>
          <Button
            onClick={() => navigate("/products/all")}
            variant="contained"
            className="mt-6"
            sx={{ mt: 3, borderRadius: "999px", px: 4, textTransform: "none", background: "#4f46e5" }}
          >
            Explore Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div
                className="relative h-48 bg-gray-50 cursor-pointer overflow-hidden"
                onClick={() =>
                  navigate(`/product-details/${item.category}/${item.title}/${item._id}`)
                }
              >
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                />
                {item.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{item.discountPercent}%
                  </div>
                )}
                {/* Remove btn */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item._id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <DeleteOutlineIcon style={{ fontSize: 16, color: "#ef4444" }} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide truncate">
                  {item.seller?.businessDetails?.businessName || "ToyVerse"}
                </p>
                <p
                  className="text-sm font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-indigo-600"
                  onClick={() =>
                    navigate(`/product-details/${item.category}/${item.title}/${item._id}`)
                  }
                >
                  {item.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-gray-900">
                    NRs {item.sellingPrice?.toLocaleString()}
                  </span>
                  {item.mrpPrice > item.sellingPrice && (
                    <span className="text-xs line-through text-gray-400">
                      NRs {item.mrpPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ background: "#4f46e5", color: "#fff" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
                >
                  <ShoppingCartIcon style={{ fontSize: 16 }} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
