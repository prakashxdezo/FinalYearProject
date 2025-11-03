const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware"); 
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware"); 
const SellerReportController = require("../controller/SellerReportController");

const router = express.Router();

router.get("/", sellerMiddleware, SellerReportController.getSellerReport);

module.exports = router;
