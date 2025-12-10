import React from "react";
import { useNavigate } from "react-router";

const ClothesCategoryCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/products/${item.categoryId}`)}
      className="flex items-center gap-2 cursor-pointer shrink-0 px-4 py-2 rounded-full border-2 border-gray-200 bg-white hover:border-orange-500 hover:shadow-md transition-all group"
    >
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={item.image}
        alt={item.name}
      />
      <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
};

export default ClothesCategoryCard;
