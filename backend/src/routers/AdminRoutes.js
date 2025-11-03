const express=require("express");
const sellerController = require("../controller/sellerController");
const adminController = require("../controller/adminController");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const router = express.Router();

router.use(adminAuthMiddleware);

router.patch("/seller/:id/status/:status", sellerController.updateSellerAccountStatus) //id is accessed through params id in sellercontroller account status method
router.get("/stats", adminController.getDashboardStats);
router.get("/revenue-analytics", adminController.getRevenueAnalytics);


router.get("/top-sellers", adminController.getTopSellers);
router.get("/top-products", adminController.getTopProducts);


router.get("/commissions", adminController.getCommissionReport);
router.patch("/commissions/:orderId/pay", adminController.markCommissionPaid);

module.exports=router;