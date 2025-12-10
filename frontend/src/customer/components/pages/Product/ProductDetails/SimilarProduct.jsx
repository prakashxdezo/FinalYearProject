import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { api } from "../../../../../config/api";

const SimilarProduct = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);

useEffect(() => {
  console.log("SimilarProduct categoryId:", categoryId);
  if (!categoryId) return;
  api
    .get("/products", {
      params: { category: categoryId, pageNumber: 0, pageSize: 10 },
    })
    .then((res) => {
      const filtered = (res.data.content || []).filter(
        (p) => p._id !== currentProductId,
      );
      setProducts(filtered.slice(0, 8));
    })
    .catch((err) => console.error("Similar products error:", err));
}, [categoryId, currentProductId]);

  if (products.length === 0)
    return <p className="text-gray-400 text-sm">No similar toys found.</p>;

  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
      {products.map((item) => (
        <ProductCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default SimilarProduct;
