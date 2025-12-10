import React, { useEffect, useState } from "react";
import "./productCard.css";
import { useNavigate } from "react-router";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { addToWishlist, removeFromWishlist } from "../../../../Redux Toolkit/features/customer/wishlistSlice";

const ProductCard = ({ item }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((s) => s.wishlist);
  const jwt = localStorage.getItem("jwt");

 const isWishlisted = wishlist?.products?.some(
   (p) => (p._id || p).toString() === item._id.toString(),
 );

  useEffect(() => {
    let interval;
    if (isHovered && item.images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % item.images.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isHovered, item.images]);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!jwt) { navigate("/"); return; }
    if (isWishlisted) {
      dispatch(removeFromWishlist({ jwt, productId: item._id }));
    } else {
      dispatch(addToWishlist({ jwt, productId: item._id }));
    }
  };

  return (
    <div
      onClick={() =>
        navigate(`/product-details/${item.category}/${item.title}/${item._id}`)
      }
      className="cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group relative"
    >
      {/* Image */}
      <div
        className="relative h-52 overflow-hidden bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        {item.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={item.title}
            className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}

        {item.quantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {item.discountPercent > 0 && item.quantity > 0 && (
          <div
            className="absolute top-2 left-2 text-white text-xs font-black px-2 py-1 rounded-md"
            style={{ background: "#e85d04" }}
          >
            -{item.discountPercent}%
          </div>
        )}

        {item.ageGroup && (
          <div
            className="absolute top-2 right-10 text-white text-xs font-bold px-2 py-1 rounded-md"
            style={{ background: "rgba(26,26,46,0.85)" }}
          >
            {item.ageGroup}
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform z-10"
        >
          {isWishlisted ? (
            <FavoriteIcon style={{ fontSize: 16, color: "#ef4444" }} />
          ) : (
            <FavoriteBorderIcon style={{ fontSize: 16, color: "#9ca3af" }} />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide truncate">
          {item?.seller?.businessDetails?.businessName || "ToyVerse"}
        </p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {item.title}
        </p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              sx={{ fontSize: 12, color: s <= 4 ? "#f59e0b" : "#d1d5db" }}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">(24)</span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-black text-gray-900">
            NRs {item.sellingPrice?.toLocaleString()}
          </span>
          {item.mrpPrice > item.sellingPrice && (
            <span className="text-xs line-through text-gray-400">
              NRs {item.mrpPrice?.toLocaleString()}
            </span>
          )}
        </div>

        <p className="text-xs text-green-600 font-semibold">✓ Free Delivery</p>
      </div>
    </div>
  );
};

export default ProductCard;
