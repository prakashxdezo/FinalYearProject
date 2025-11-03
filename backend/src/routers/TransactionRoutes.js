const express = require("express");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");
const TransactionController = require("../controller/TransactionController");

const router = express.Router();

router.get(
  "/seller",
  sellerMiddleware,
  TransactionController.getTransactionBySeller
);

module.exports = router;