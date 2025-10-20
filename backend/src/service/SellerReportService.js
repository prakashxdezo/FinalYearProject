const SellerReport = require("../model/SellerReport");
const OrderService = require("./OrderService");



class SellerReportService {
  async getSellerReport(seller) {
    try {
      let sellerReport = await SellerReport.findOne({ seller: seller._id });
      console.log("seller Report", sellerReport);

      if (!sellerReport) {
        sellerReport = new SellerReport({
          seller: seller._id,
          totalOrders: 0,
          totalEarnings: 0,
          totalSales: 0,
          totalRefunds: 0,
          canceledOrders: 0,
          netEarnings: 0,
          totalTransactions: 0,
        });
        sellerReport = await sellerReport.save();
      }
      return sellerReport;
    } catch (error) {
      throw new Error(`Error fetching seller report: ${error.message}`);
    }
  }

  async updateSellerReport(sellerReport) {
    try {
      return await SellerReport.findByIdAndUpdate(
        sellerReport._id,
        sellerReport,
        { new: true }
      );
    } catch (err) {
      throw new Error(`Error updating seller report: ${err.message}`);
    }
  }

  async updateReportForTransaction(transaction) {
    try {
      const sellerReport = await this.getSellerReport(transaction.seller);

      const order = await OrderService.findOrderById(transaction.order);

      sellerReport.totalOrders += 1;
      sellerReport.totalTransactions += 1;
      sellerReport.totalEarnings += order.totalSellingPrice;
      sellerReport.totalSales += order.totalSellingPrice;
      sellerReport.netEarnings = sellerReport.totalEarnings - sellerReport.totalRefunds;

      return await sellerReport.save();
    } catch (err) {
      throw new Error(
        `Error updating seller report for transaction: ${err.message}`
      );
    }
  }
}

module.exports = new SellerReportService();