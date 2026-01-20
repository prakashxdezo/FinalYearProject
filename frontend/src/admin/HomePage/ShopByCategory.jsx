import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../Redux Toolkit/store';

const image =
  "https://i5.walmartimages.com/seo/Keasmto-Women-Skirts-Black-Pleated-Skirt-Midi-Long-Cheetah-High-Waist-Ladies-Elasticized-Summer-A-Line-Skirts-for-Work-Office-M_f7173386-ebc9-4044-976a-e227050c1b0b.ae7e498b0eeb6357f652c731315dd66f.jpeg";

  const ShopByCategory = () => {
   const homeCategories = useAppSelector(
        (store) => store.homeCategory.homeCategories,
      );

  return (
    <HomeCategoryTable categories={homeCategories?.SHOP_BY_CATEGORIES}/>
  )
}

export default ShopByCategory
