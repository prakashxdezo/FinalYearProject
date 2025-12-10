import React, { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductCard from "./ProductCard";
import Pagination from "@mui/material/Pagination";
import TuneIcon from "@mui/icons-material/Tune";
import { useParams, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";
import { getAllProducts } from "../../../../Redux Toolkit/features/customer/productSlice";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Products = () => {
  const [sort, setSort] = useState("price_low");
  const [page, setPage] = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const { products, totalPages, loading } = useAppSelector((store) => store.product);
  const dispatch = useAppDispatch();

  const ageGroup = searchParams.get("ageGroup") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
   dispatch(
     getAllProducts({
       category: categoryId,
       sort,
       ageGroup,
       minPrice,
       maxPrice,
       pageNumber: page - 1,
       pageSize: 12,
     }),
   );
  }, [categoryId, sort, ageGroup, minPrice, maxPrice, page]);

  const categoryLabel = categoryId?.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "All Toys";

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{ background: "#1a1a2e" }} className="px-5 lg:px-16 py-6">
        <h1 className="section-heading text-3xl text-white">{categoryLabel}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {loading ? "Loading..." : `${products?.length || 0} toys found`}
        </p>
      </div>

      <div className="flex lg:px-16 px-4 py-6 gap-6">

        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-28">
            <div style={{ background: "#1a1a2e" }} className="px-5 py-3">
              <p className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <TuneIcon sx={{ fontSize: 16 }} /> Filters
              </p>
            </div>
            <FilterSection />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        <Drawer open={mobileFilter} onClose={() => setMobileFilter(false)}>
          <div className="w-72">
            <div style={{ background: "#1a1a2e" }} className="px-5 py-3 flex items-center justify-between">
              <p className="text-white font-bold text-sm uppercase">Filters</p>
              <IconButton onClick={() => setMobileFilter(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </div>
            <FilterSection />
          </div>
        </Drawer>

        {/* Main content */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between mb-4">
            <button
              className="lg:hidden flex items-center gap-2 text-sm font-bold text-gray-700"
              onClick={() => setMobileFilter(true)}
            >
              <TuneIcon fontSize="small" /> Filters
            </button>
            <p className="text-sm text-gray-500 hidden lg:block">
              Showing {products?.length || 0} results
            </p>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="price_low">Price: Low → High</MenuItem>
                <MenuItem value="price_high">Price: High → Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-72 animate-pulse border border-gray-200" />
              ))
            ) : products?.length > 0 ? (
              products.map((item) => <ProductCard key={item._id} item={item} />)
            ) : (
              <div className="col-span-4 text-center py-24">
                <p className="text-5xl mb-4">🧸</p>
                <p className="text-gray-500 font-semibold">No toys found in this category yet.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 pb-4">
            <Pagination
              count={totalPages || 1}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
