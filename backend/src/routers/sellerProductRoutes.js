const express = require("express");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware.js");
const requireActiveSellerStatus = require("../middlewares/sellerStatusMiddleware");
const ProductController = require("../controller/ProductController.js");
const router = express.Router();

router.get("/", sellerMiddleware, ProductController.getProductBySeller);


router.post(
  "/",
  sellerMiddleware,
  requireActiveSellerStatus,
  ProductController.createProduct,
);

router.delete(
  "/:productId",
  sellerMiddleware,
  requireActiveSellerStatus,
  ProductController.deleteProduct,
);

router.patch(
  "/:productId",
  sellerMiddleware,
  requireActiveSellerStatus,
  ProductController.updateProduct,
);

module.exports = router;
