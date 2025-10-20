const { default: mongoose } = require("mongoose");
const Address = require("../model/Address");
const CartItem = require("../model/CartItem");
const Order = require("../model/Order");
const OrderItem = require("../model/OrderItem");
const User = require("../model/User");
const OrderStatus = require("../domain/OrderStatus");
const Product = require("../model/Product");

const { ADMIN_COMMISSION_PERCENTAGE } = require("../util/config");

class OrderService {
  async createOrder(user, shippingAddress, cart) {
    if (shippingAddress._id && !user.addresses.includes(shippingAddress._id)) {
      user.addresses.push(shippingAddress._id);
      await User.findByIdAndUpdate(user._id, user);
    }

    if (!shippingAddress._id) {
      shippingAddress = await Address.create(shippingAddress);
    }

    const itemsBySeller = cart.cartItems.reduce((acc, item) => {
      const sellerId = item.product.seller._id.toString();
      acc[sellerId] = acc[sellerId] || [];
      acc[sellerId].push(item);
      return acc;
    }, {});

    const orders = new Set();

    for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
      const totalOrderPrice = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice * 100,
        0,
      );

      const totalItem = cartItems.length;

      const commissionAmount = Math.round(
        (totalOrderPrice * ADMIN_COMMISSION_PERCENTAGE) / 100,
      );
      const sellerEarning = totalOrderPrice - commissionAmount;

      const neworder = new Order({
        user: user._id,
        seller: sellerId,
        shippingAddress: {
          _id: shippingAddress._id,
          name: shippingAddress.name,
          mobile: shippingAddress.mobile,
          address: shippingAddress.address,
          locality: shippingAddress.locality,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },
        orderItems: [],
        totalMrpPrice: totalOrderPrice,
        totalSellingPrice: totalOrderPrice,
        totalItem: totalItem,

        // Commission fields
        commissionRate: ADMIN_COMMISSION_PERCENTAGE,
        commissionAmount: commissionAmount,
        sellerEarning: sellerEarning,
        commissionPaid: false,
      });

      const orderItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          const orderItem = new OrderItem({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            sellingPrice: cartItem.sellingPrice * 100,
            mrpPrice: cartItem.mrpPrice * 100,
            size: cartItem.size,
            userId: cartItem.userId,
          });

          const savedOrderItem = await orderItem.save();
          neworder.orderItems.push(savedOrderItem._id);

          await Product.findByIdAndUpdate(
            cartItem.product._id,
            { $inc: { quantity: -cartItem.quantity } },
            { new: true },
          );

          return savedOrderItem;
        }),
      );

      const savedOrder = await neworder.save();
      orders.add(savedOrder);
    }
    return Array.from(orders);
  }

  async findOrderById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }

    const order = await Order.findById(orderId).populate([
      { path: "user" },
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);

    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async usersOrderHistory(userId) {
    return await Order.find({ user: userId }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async getSellersOrder(sellerId) {
    return await Order.find({ seller: sellerId })
      .sort({ orderDate: -1 })
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);
  }

  async updateOrderStatus(orderId, status) {
    const order = await this.findOrderById(orderId);

    order.orderStatus = status;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }

    // Use $set to only update orderStatus field, avoiding any document conflicts
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { orderStatus: status } },
      { new: true },
    ).populate([
      { path: "user" },
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  }

  async cancelOrder(orderId, user) {
    const order = await this.findOrderById(orderId);

    const orderUserId = order.user?._id
      ? order.user._id.toString()
      : order.user.toString();

    console.log("order user id:", orderUserId);
    console.log("req user id:", user._id.toString());

    if (user._id.toString() !== orderUserId) {
      throw new Error("You cannot cancel this order.");
    }

    order.orderStatus = OrderStatus.CANCELLED;

    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
    }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async findOrderItemById(orderItemId) {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID");
    }

    const orderItem = await OrderItem.findById(orderItemId).populate("product");

    if (!orderItem) {
      throw new Error("Order Item not found");
    }
    return orderItem;
  }
}

module.exports = new OrderService();
