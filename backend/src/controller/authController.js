// AuthController.js
const UserRoles = require("../domain/UserRole");
const AuthService = require("../service/AuthService");
const Order = require("../model/Order");
const PaymentStatus = require("../domain/PaymentStatus");

class AuthController {
  async sendLoginOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const result = await AuthService.sendLoginOTP(email);
      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const jwt = await AuthService.createUser(req.body);
      const authResponse = {
        jwt,
        message: "User created successfully",
        role: UserRoles.CUSTOMER,
      };
      res.status(200).json(authResponse);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async signin(req, res) {
    try {
      const authResponse = await AuthService.signin(req.body);
      res.status(200).json(authResponse);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async getCommissionSummary(req, res) {
    try {
      const completedOrders = await Order.find({
        paymentStatus: PaymentStatus.COMPLETED,
      }).populate("seller", "businessName email");

      const totalRevenue = completedOrders.reduce(
        (s, o) => s + (o.totalSellingPrice || 0),
        0,
      );
      const totalCommission = completedOrders.reduce(
        (s, o) => s + (o.commissionAmount || 0),
        0,
      );
      const totalSellerPayout = completedOrders.reduce(
        (s, o) => s + (o.sellerEarning || 0),
        0,
      );
      const unpaidCommission = completedOrders
        .filter((o) => !o.commissionPaid)
        .reduce((s, o) => s + (o.commissionAmount || 0), 0);

      return res.status(200).json({
        totalRevenue,
        totalCommission,
        totalSellerPayout,
        unpaidCommission,
        totalOrders: completedOrders.length,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getCommissionOrders(req, res) {
    try {
      const orders = await Order.find({
        paymentStatus: PaymentStatus.COMPLETED,
      })
        .populate("seller", "businessName email")
        .populate("user", "fullName email")
        .sort({ createdAt: -1 });

      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async markCommissionPaid(req, res) {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { commissionPaid: true },
        { new: true },
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res
        .status(200)
        .json({ message: "Commission marked as paid", order });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
