import React from "react";
import ClothesCategoryCard from "./ClothesCategoryCard";
import { useAppSelector } from "../../../../../Redux Toolkit/store";

const ClothesCategory = () => {
  const homeCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories,
  );

  return (
    <div className="flex gap-2 overflow-x-auto py-4 lg:px-16 px-5 scrollbar-hide">
      {homeCategories.CLOTHES_CATEGORIES?.map((item) => (
        <ClothesCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  );
};

export default ClothesCategory;
