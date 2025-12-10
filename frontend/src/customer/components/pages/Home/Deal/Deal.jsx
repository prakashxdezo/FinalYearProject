import React, { useEffect } from "react";
import DealCard from "./DealCard";
import Slider from "react-slick";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../Redux Toolkit/store";
import { getAllDeals } from "../../../../../Redux Toolkit/features/Admin/DealSlice";

const Deal = () => {
  const dispatch = useAppDispatch();
  const { deals = [] } = useAppSelector((store) => store.deal);
  const dealCategories = useAppSelector(
    (store) => store.homeCategory.homeCategories.DEAL_CATEGORIES || [],
  );

  useEffect(() => {
    dispatch(getAllDeals());
  }, []);

  const getCategoryImage = (categoryId) => {
    const cat = dealCategories.find((c) => c.categoryId === categoryId);
    return cat?.image || "https://via.placeholder.com/300";
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: Math.min(4, deals.length || 1),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  if (deals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No deals available yet.
      </div>
    );
  }

  return (
    <div className="py-5 lg:px-20">
      <div className="slide-container">
        <Slider {...settings}>
          {deals.map((deal) => (
            <div key={deal._id} className="px-2">
              <DealCard
                deal={{
                  image: getCategoryImage(deal.category),
                  discount: deal.discount,
                  category: deal.category,
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Deal;
