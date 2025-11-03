const adminService = require("../service/AdminService");

class AdminController {
  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get top sellers
  async getTopSellers(req, res) {
    try {
      const { limit = 10, period = "all" } = req.query;
      const topSellers = await adminService.getTopSellers(
        parseInt(limit),
        period,
      );
      res.status(200).json(topSellers);
    } catch (error) {
      console.error("Error fetching top sellers:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get top products
  async getTopProducts(req, res) {
    try {
      const { limit = 10, period = "all" } = req.query;
      const topProducts = await adminService.getTopProducts(
        parseInt(limit),
        period,
      );
      res.status(200).json(topProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get commission report
  async getCommissionReport(req, res) {
    try {
      const { status = "all", page = 1, limit = 20 } = req.query;
      const report = await adminService.getCommissionReport(
        status,
        parseInt(page),
        parseInt(limit),
      );
      res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching commission report:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Mark commission as paid
  async markCommissionPaid(req, res) {
    try {
      const { orderId } = req.params;
      const order = await adminService.markCommissionPaid(orderId);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error marking commission paid:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(req, res) {
    try {
      const { period = "month" } = req.query;
      const analytics = await adminService.getRevenueAnalytics(period);
      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();
