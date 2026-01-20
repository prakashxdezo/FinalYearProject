import { useAppSelector } from "../../Redux Toolkit/store";
import HomeCategoryTable from "../HomePage/HomeCategoryTable";


export default function DealCategoryTable() {
  const homeCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories
  );
  return <HomeCategoryTable categories={homeCategories.DEAL_CATEGORIES} />;
}
