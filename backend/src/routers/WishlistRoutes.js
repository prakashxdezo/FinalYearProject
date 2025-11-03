const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const wishlistController = require("../controller/wishlistController");

const router = express.Router();

router.get("/", authMiddleware, wishlistController.getWishlist);
router.post("/add", authMiddleware, wishlistController.addToWishlist);
router.delete("/remove/:productId", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
