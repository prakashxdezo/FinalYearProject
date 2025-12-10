import React from "react";
import { useAppSelector } from "../../../../../Redux Toolkit/store";

const Grid = () => {
  const category = useAppSelector(
    (store) => store.homeCategory.homeCategories?.GRID,
  );

  
  if (!category || category.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No grid items available.
      </div>
    );
  }

  return (
    <div className="flex justify-center ">
      <div className="grid gap-3 grid-rows-12 grid-cols-12 lg:h-150 px-5 lg:px-20 ml-10">
   
        <div className="col-span-4 row-span-11 text-white rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={category[0]?.image}
            alt={category[0]?.name || ""}
          />
        </div>

        <div className="col-span-2 row-span-6 text-white rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={category[1]?.image}
            alt={category[1]?.name || ""}
          />
        </div>

        <div className="col-span-4 row-span-6 text-white rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={category[2]?.image}
            alt={category[2]?.name || ""}
          />
        </div>

        <div className="col-span-4 row-span-12 text-white rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={category[3]?.image}
            alt={category[3]?.name || ""}
          />
        </div>

        <div className="col-span-4 row-span-6 text-white rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={category[4]?.image}
            alt={category[4]?.name || ""}
          />
        </div>
      </div>
    </div>
  );   
};

export default Grid;
