import React from "react";
import { actionFiguresLevelTwo } from "../../data/Category/level two/actionFiguresLevelTwo";
import { educationalToysLevelTwo } from "../../data/Category/level two/educationalToysLevelTwo";
import { boardGamesLevelTwo } from "../../data/Category/level two/boardGamesLevelTwo";
import { outdoorToysLevelTwo } from "../../data/Category/level two/outdoorToysLevelTwo";
import { actionFiguresLevelThree } from "../../data/Category/level three/actionFiguresLevelThree";
import { educationalToysLevelThree } from "../../data/Category/level three/educationalToysLevelThree";
import { boardGamesLevelThree } from "../../data/Category/level three/boardGamesLevelThree";
import { outdoorToysLevelThree } from "../../data/Category/level three/outdoorToysLevelThree";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const categoryTwo = {
  "action-figures": actionFiguresLevelTwo,
  "educational-toys": educationalToysLevelTwo,
  "board-games": boardGamesLevelTwo,
  "outdoor-toys": outdoorToysLevelTwo,
};

const categoryThree = {
  "action-figures": actionFiguresLevelThree,
  "educational-toys": educationalToysLevelThree,
  "board-games": boardGamesLevelThree,
  "outdoor-toys": outdoorToysLevelThree,
};

const CategorySheet = ({ selectedCategory, setShowSheet }) => {
  const navigate = useNavigate();
  const childCategory = (category, parentCategoryId) =>
    category?.filter((child) => child.parentCategoryId === parentCategoryId);

  return (
    <div
      style={{
        background: "#1a1a2e",
        borderTop: "2px solid #e85d04",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex lg:px-16 px-5 py-6 gap-8 flex-wrap">
        {categoryTwo[selectedCategory]?.map((item) => (
          <div key={item.name} className="min-w-[160px]">
            <p
              className="text-xs font-black tracking-widest uppercase mb-3 pb-2 border-b"
              style={{ color: "#e85d04", borderColor: "#333" }}
            >
              {item.name}
            </p>
            <ul className="space-y-2">
              {childCategory(categoryThree[selectedCategory], item.categoryId)?.map(
                (child) => (
                  <li
                    key={child.categoryId}
                    onClick={() => {
                      navigate(`/products/${child.categoryId}`);
                      setShowSheet(false);
                    }}
                    className="flex items-center gap-1 text-sm cursor-pointer group"
                    style={{ color: "#94a3b8" }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 12, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100" />
                    <span className="group-hover:text-white transition-colors">
                      {child.name}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySheet;
