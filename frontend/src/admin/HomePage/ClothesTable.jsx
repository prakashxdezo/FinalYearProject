import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../Redux Toolkit/store';

const ClothesTable = () => {
  const homeCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories,
  );
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">🧸 Toy Category Banners</h2>
      <HomeCategoryTable categories={homeCategories?.CLOTHES_CATEGORIES} />
    </>
  );
};

export default ClothesTable;
