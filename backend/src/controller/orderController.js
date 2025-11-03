const { response } = require("express");
const CartService = require("../service/CartService");
const OrderService = require("../service/OrderService");
const PaymentService = require("../service/PaymentService");
const PaymentStatus = require("../domain/PaymentStatus");

class Ordercontroller {
  async createOrder(req, res) {
    const { shippingAddress } = req.body;
    const paymentMethod = req.query.paymentMethod || "COD";

    try {
      const user = req.user;
      const cart = await CartService.findUserCart(user);
      const orders = await OrderService.createOrder(
        user,
        shippingAddress,
        cart,
      );

      let paymentOrder = null;

      if (paymentMethod === "KHALTI") {
        paymentOrder = await PaymentService.createOrder(user, orders, paymentMethod);
        for (let order of orders) { order.paymentStatus = PaymentStatus.PENDING; await order.save(); }
        const khaltiLink = await PaymentService.generateKhaltiPaymentLink(paymentOrder);
        return res.status(200).json({ message: "Order created successfully", orders, paymentOrder, paymentMethod, khaltiLink });

      } else if (paymentMethod === "ESEWA") {
        paymentOrder = await PaymentService.createOrder(user, orders, paymentMethod);
        for (let order of orders) { order.paymentStatus = PaymentStatus.PENDING; await order.save(); }
        // Return paymentOrderId so frontend can call /esewa/initiate
        return res.status(200).json({ message: "Order created successfully", orders, paymentOrder, paymentOrderId: paymentOrder._id, paymentMethod });

      } else {
        // COD
        for (let order of orders) { order.paymentStatus = PaymentStatus.PROCESSING; await order.save(); }
      }

      return res.status(200).json({ message: "Order created successfully", orders, paymentOrder, paymentMethod });
    } catch (error) {
      console.error("Error creating order:", error);
      return res
        .status(500)
        .json({ message: `Error creating order: ${error.message}` });
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.findOrderById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getOrderItemById(req, res, next) {
    try {
      const { orderItemId } = req.params;
      const orderItem = await OrderService.findOrderItemById(orderItemId);
      return res.status(200).json(orderItem);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getUserOrderHistory(req, res) {
    const user = await req.user;
    try {
      const orderHistory = await OrderService.usersOrderHistory(user._id);

      return res.status(200).json(orderHistory);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
  async getSellersOrders(req, res) {
    try {
      const sellerId = req.seller._id;
      const orders = await OrderService.getSellersOrder(sellerId);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId, orderStatus } = req.params;

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        orderStatus,
      );
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      console.log("cancelOrder called - orderId:", orderId);
      console.log("cancelOrder called - user:", req.user._id);

      const cancelOrder = await OrderService.cancelOrder(orderId, req.user);
      return res.status(200).json({
        message: "order cancelled successfully",
        order: cancelOrder,
      });
    } catch (error) {
      console.error("cancelOrder ERROR:", error.message); // ← ADD THIS
      return res.status(500).json({ error: error.message }); // ← change 401 to 500
    }
  }

  async confirmCOD(req, res) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.findOrderById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.paymentStatus = PaymentStatus.COMPLETED;
      await order.save();

      // Optional email
      const sendVerificationEmail = require("../utils/sendVerificationEmail");
      await sendVerificationEmail(
        req.user.email,
        "Payment Received (COD)",
        `<p>Payment for order ${orderId} collected successfully via Cash on Delivery.</p>`,
      );

      return res.status(200).json({ success: true, order });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new Ordercontroller();
