const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");


router.post("/send/login-signup-otp", authController.sendLoginOtp);

router.post("/signup", authController.createUser);
router.post("/signin", authController.signin);

module.exports = router;