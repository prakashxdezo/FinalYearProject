const express = require("express");
const router = express.Router();

const sellerController = require("../controller/sellerController");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");

console.log("Seller Routes Loaded");

router.post("/send/login-otp", sellerController.sendLoginOtp);
router.post("/verify/login-otp", sellerController.verifyLoginOtp);
router.post("/", sellerController.createSeller);


router.get("/profile", sellerMiddleware, sellerController.getSellerProfile);
router.patch(
  "/profile",
  sellerMiddleware,
  sellerController.updateSellerProfile,
);
router.patch("/", sellerMiddleware, sellerController.updateSeller);


router.get("/", adminAuthMiddleware, sellerController.getAllSellers);


router.patch(
  "/:id/status",
  adminAuthMiddleware,
  sellerController.updateSellerAccountStatus,
);

// Delete seller (admin only)
router.delete("/:id", adminAuthMiddleware, sellerController.deleteSeller);

module.exports = router;
