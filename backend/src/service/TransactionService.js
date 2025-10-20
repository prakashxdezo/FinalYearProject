const Order = require("../model/Order");
const Seller = require("../model/Seller");
const Transaction = require("../model/Transaction");

class TransactionService{
    async createTransaction(orderId){
        const id = orderId?._id || orderId;

        const order = await Order.findById(id).populate('seller');
        if (!order){
            throw new Error('Order not found');
        }

        const existing = await Transaction.findOne({ order: order._id });
        if (existing) return existing;

        const transaction = new Transaction({
            seller: order.seller._id,
            customer: order.user,
            order: order._id,
        });

        return await transaction.save();
    }

    async getTransactionBySellerId(sellerId){
        return await Transaction.find({ seller: sellerId })
          .populate("order")
          .populate("customer");
    }

    async getAllTransactions(){
         return await Transaction.find().populate("seller")
            .populate("order")
            .populate("customer");
    }
}

module.exports = new TransactionService();