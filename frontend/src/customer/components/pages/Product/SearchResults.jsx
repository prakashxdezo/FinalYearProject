import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { api } from "../../../../config/api";
import ProductCard from "./ProductCard";
import CircularProgress from "@mui/material/CircularProgress";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    api
      .get(`/products/search?q=${encodeURIComponent(query)}`)
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Search error:", err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="px-5 lg:px-20 pt-10 min-h-screen">
      <h1 className="text-xl font-bold mb-2">
        Search results for <span className="text-orange-500">"{query}"</span>
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {products.length} products found
      </p>

      {loading ? (
        <div className="flex justify-center pt-20">
          <CircularProgress color="warning" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center pt-20 text-gray-400">
          <p className="text-lg">No products found for "{query}"</p>
          <p className="text-sm mt-2">Try searching with different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
