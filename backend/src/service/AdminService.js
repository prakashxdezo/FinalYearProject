const Order = require("../model/Order");
const User = require("../model/User");
const Seller = require("../model/Seller");
const Product = require("../model/Product");
const OrderItem = require("../model/OrderItem");
const OrderStatus = require("../domain/OrderStatus");

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalSellers,
      activeSellers,
      pendingSellers,
      totalOrders,
      revenueStats,
      commissionStats,
      ordersByStatus,
    ] = await Promise.all([
      // Total users
      User.countDocuments(),
      // Total sellers
      Seller.countDocuments(),
      // Active sellers
      Seller.countDocuments({ accountStatus: "ACTIVE" }),
      // Pending verification sellers
      Seller.countDocuments({ accountStatus: "PENDING_VERIFICATION" }),
      // Total orders (non-cancelled)
      Order.countDocuments({ orderStatus: { $ne: OrderStatus.CANCELLED } }),
      // Revenue stats
      Order.aggregate([
        { $match: { orderStatus: { $ne: OrderStatus.CANCELLED } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalSellingPrice" },
            totalMrp: { $sum: "$totalMrpPrice" },
          },
        },
      ]),
      // Commission stats
      Order.aggregate([
        { $match: { orderStatus: { $ne: OrderStatus.CANCELLED } } },
        {
          $group: {
            _id: null,
            totalCommission: { $sum: "$commissionAmount" },
            paidCommission: {
              $sum: { $cond: ["$commissionPaid", "$commissionAmount", 0] },
            },
            unpaidCommission: {
              $sum: {
                $cond: [{ $not: "$commissionPaid" }, "$commissionAmount", 0],
              },
            },
          },
        },
      ]),
      // Orders by status
      Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      users: {
        total: totalUsers,
      },
      sellers: {
        total: totalSellers,
        active: activeSellers,
        pending: pendingSellers,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
      revenue: {
        total: revenueStats[0]?.totalRevenue || 0,
        totalMrp: revenueStats[0]?.totalMrp || 0,
      },
      commissions: {
        total: commissionStats[0]?.totalCommission || 0,
        paid: commissionStats[0]?.paidCommission || 0,
        unpaid: commissionStats[0]?.unpaidCommission || 0,
      },
    };
  }

  // Get top sellers by revenue
  async getTopSellers(limit = 10, period = "all") {
    const dateFilter = this.getDateFilter(period);

    const topSellers = await Order.aggregate([
      {
        $match: { ...dateFilter, orderStatus: { $ne: OrderStatus.CANCELLED } },
      },
      {
        $group: {
          _id: "$seller",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalSellingPrice" },
          totalCommission: { $sum: "$commissionAmount" },
          totalItems: { $sum: "$totalItem" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "sellers",
          localField: "_id",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      { $unwind: "$sellerDetails" },
      {
        $project: {
          sellerId: "$_id",
          sellerName: "$sellerDetails.sellerName",
          email: "$sellerDetails.email",
          businessName: "$sellerDetails.businessDetails.businessName",
          accountStatus: "$sellerDetails.accountStatus",
          totalOrders: 1,
          totalRevenue: 1,
          totalCommission: 1,
          totalItems: 1,
        },
      },
    ]);

    return topSellers;
  }

  // Get top selling products
  async getTopProducts(limit = 10, period = "all") {
    const dateFilter = this.getDateFilter(period);

    // First get orders within the period
    const orders = await Order.find({
      ...dateFilter,
      orderStatus: { $ne: OrderStatus.CANCELLED },
    }).select("orderItems orderDate");

    const orderItemIds = orders.flatMap((order) => order.orderItems);

    const topProducts = await OrderItem.aggregate([
      { $match: { _id: { $in: orderItemIds } } },
      {
        $group: {
          _id: "$product",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$sellingPrice" },
          totalMrp: { $sum: "$mrpPrice" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "sellers",
          localField: "productDetails.seller",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      { $unwind: { path: "$sellerDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: "$_id",
          title: "$productDetails.title",
          images: "$productDetails.images",
          category: "$productDetails.category",
          mrpPrice: "$productDetails.mrpPrice",
          sellingPrice: "$productDetails.sellingPrice",
          sellerName: "$sellerDetails.sellerName",
          sellerId: "$productDetails.seller",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return topProducts;
  }

  // Get commission report
  async getCommissionReport(status = "all", page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { orderStatus: { $ne: OrderStatus.CANCELLED } };

    if (status === "paid") {
      filter.commissionPaid = true;
    } else if (status === "unpaid") {
      filter.commissionPaid = false;
    }

    const [commissions, total] = await Promise.all([
      Order.find(filter)
        .populate("seller", "sellerName email businessDetails.businessName")
        .select(
          "totalSellingPrice commissionRate commissionAmount commissionPaid sellerEarning orderDate orderStatus",
        )
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    // Calculate totals
    const totals = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commissionAmount" },
          totalRevenue: { $sum: "$totalSellingPrice" },
          totalSellerEarnings: { $sum: "$sellerEarning" },
        },
      },
    ]);

    return {
      commissions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      totals: totals[0] || {
        totalCommission: 0,
        totalRevenue: 0,
        totalSellerEarnings: 0,
      },
    };
  }

  // Mark commission as paid
  async markCommissionPaid(orderId) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { commissionPaid: true },
      { new: true },
    ).populate("seller", "sellerName email");

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  // Get revenue analytics
  async getRevenueAnalytics(period = "month") {
    const groupBy = this.getGroupByFormat(period);
    const dateFilter = this.getDateFilter(period);

    const revenue = await Order.aggregate([
      {
        $match: { ...dateFilter, orderStatus: { $ne: OrderStatus.CANCELLED } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupBy, date: "$orderDate" },
          },
          revenue: { $sum: "$totalSellingPrice" },
          orders: { $sum: 1 },
          commission: { $sum: "$commissionAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return revenue;
  }

  // Helper: Get date filter based on period
  getDateFilter(period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return {}; // all time
    }

    return { orderDate: { $gte: startDate } };
  }

  // Helper: Get group format for aggregation
  getGroupByFormat(period) {
    switch (period) {
      case "today":
        return "%H:00"; // Group by hour
      case "week":
        return "%Y-%m-%d"; // Group by day
      case "month":
        return "%Y-%m-%d"; // Group by day
      case "year":
        return "%Y-%m"; // Group by month
      default:
        return "%Y-%m-%d"; // Group by day
    }
  }
}

module.exports = new AdminService();
