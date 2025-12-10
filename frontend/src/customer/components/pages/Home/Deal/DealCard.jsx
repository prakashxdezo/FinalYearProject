import React from "react";
import { useNavigate } from "react-router";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const DealCard = ({ deal }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/products/${deal.category}`)}
      className="cursor-pointer group rounded-lg overflow-hidden border border-white/10 hover:border-orange-500 transition-all duration-300"
      style={{ background: "#16213e" }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
          src={deal.image}
          alt={deal.category}
        />
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-black"
          style={{ background: "#e85d04" }}
        >
          <LocalOfferIcon sx={{ fontSize: 12 }} />
          DEAL
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm capitalize">
            {deal.category?.replace(/-/g, " ")}
          </p>
          <p className="text-slate-400 text-xs">Limited time offer</p>
        </div>
        <div className="text-right">
          <p className="section-heading text-2xl font-black" style={{ color: "#e85d04" }}>
            {deal.discount}%
          </p>
          <p className="text-xs text-slate-400">OFF</p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
