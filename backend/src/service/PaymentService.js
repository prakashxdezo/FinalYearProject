const axios = require("axios");
const PaymentStatus = require("../domain/PaymentStatus");
const PaymentOrder = require("../model/PaymentOrder");

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";
const KHALTI_KEY = process.env.KHALTI_SECRET_KEY;

class PaymentService {
  async createOrder(user, cartItems, paymentMethod) {
    const amount = cartItems.reduce(
      (sum, item) => sum + (item.totalSellingPrice || item.price || 0),
      0
    );
    const paymentOrder = new PaymentOrder({
      amount,
      user: user._id,
      orders: cartItems,
      paymentMethod,
      status: PaymentStatus.PENDING,
    });
    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findById(orderId);
    if (!paymentOrder) throw new Error("Payment order not found");
    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await PaymentOrder.findOne({ paymentLinkId });
    if (!paymentOrder) throw new Error("Payment Order not found");
    return paymentOrder;
  }

  async generateKhaltiPaymentLink(paymentOrder) {
    try {
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        {
          return_url: `${FRONTEND}/payment/success?paymentOrderId=${paymentOrder._id}`,
          website_url: FRONTEND,
          amount: paymentOrder.amount * 100, // NPR paisa
          purchase_order_id: paymentOrder._id.toString(),
          purchase_order_name: "ToyVerse Order",
        },
        {
          headers: {
            Authorization: `Key ${KHALTI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.payment_url;
    } catch (err) {
      console.error("Khalti link error:", err.response?.data || err.message);
      throw new Error("Failed to create Khalti payment link: " + JSON.stringify(err.response?.data || err.message));
    }
  }
}

module.exports = new PaymentService();
