const express = require("express");
const router = express.Router();
const DealController = require("../controller/DealController");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");


router.get("/", DealController.getAllDeals);


router.post("/", adminAuthMiddleware, DealController.createDeals);
router.patch("/:id", adminAuthMiddleware, DealController.updateDeal);
router.delete("/:id", adminAuthMiddleware, DealController.deleteDeals);

module.exports = router;
