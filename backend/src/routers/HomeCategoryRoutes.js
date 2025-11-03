const express = require("express");
const router = express.Router();

const HomeCategoryController = require("../controller/HomeCategoryController.js");

router.post("/categories", HomeCategoryController.createHomeCategories);
router.get("/home-category", HomeCategoryController.getHomeCategory);
router.patch("/home-category/:id", HomeCategoryController.updateHomeCategory);
router.delete("/home-category/:id", HomeCategoryController.deleteHomeCategory);

module.exports = router;
