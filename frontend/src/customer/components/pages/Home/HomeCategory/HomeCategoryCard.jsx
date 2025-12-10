import React from "react";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HomeCategoryCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/products/${item.categoryId}`)}
      className="relative rounded-xl overflow-hidden cursor-pointer group h-52 shadow-sm hover:shadow-xl transition-all duration-300"
      style={{ background: "#1a1a2e" }}
    >
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
            {item.parentCategoryId || ""}
          </p>
          <h3 className="section-heading text-xl text-white capitalize">{item.name}</h3>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "#e85d04" }}
        >
          <ArrowForwardIcon sx={{ color: "white", fontSize: 16 }} />
        </div>
      </div>
    </div>
  );
};

export default HomeCategoryCard;
