import React from "react";
import HomeCategoryCard from "./HomeCategoryCard";
import { useAppSelector } from "../../../../../Redux Toolkit/store";

const HomeCategory = () => {
  const categories = useAppSelector(
    (store) => store.homeCategory.homeCategories?.SHOP_BY_CATEGORIES,
  );
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories?.map((item) => (
        <HomeCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  );
};

export default HomeCategory;
