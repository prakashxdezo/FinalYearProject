const axios = require("axios");
const crypto = require("crypto");
const PaymentService = require("../service/PaymentService");
const PaymentStatus = require("../domain/PaymentStatus");
const TransactionService = require("../service/TransactionService");
const OrderService = require("../service/OrderService");
const SellerReportService = require("../service/SellerReportService");
const sendVerificationEmail = require("../util/sendEmail");

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";
const KHALTI_KEY = process.env.KHALTI_SECRET_KEY;
const ESEWA_SECRET = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_URL = process.env.ESEWA_GATEWAY_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

class PaymentController {
  async initiateKhaltiPayment(req, res) {
    const { amount, orderId, orderName, returnUrl } = req.body;
    if (!amount || !orderId || !orderName) {
      return res.status(400).json({
        success: false,
        message: "amount, orderId and orderName are required",
      });
    }
    try {
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        {
          return_url: returnUrl || `${FRONTEND}/payment/success`,
          website_url: FRONTEND,
          amount,
          purchase_order_id: String(orderId),
          purchase_order_name: orderName,
        },
        {
          headers: {
            Authorization: `Key ${KHALTI_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      return res.status(200).json(response.data);
    } catch (err) {
      console.error(
        "Khalti initiate error:",
        err.response?.data || err.message,
      );
      return res
        .status(500)
        .json({ success: false, error: err.response?.data || err.message });
    }
  }

  async verifyPayment(req, res) {
    const { pidx, paymentOrderId } = req.body;
    if (!pidx)
      return res.status(400).json({ success: false, message: "Missing pidx" });

    try {
      const khaltiResponse = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: `Key ${KHALTI_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      const khaltiData = khaltiResponse.data;
      if (khaltiData.status !== "Completed") {
        return res.status(400).json({
          success: false,
          message: "Payment not completed. Status: " + khaltiData.status,
        });
      }
      if (paymentOrderId) {
        await PaymentController._finalizePayment(
          paymentOrderId,
          pidx,
          req.user,
        );
        const paymentOrder =
          await PaymentService.getPaymentOrderById(paymentOrderId);
        return res.status(200).json({
          success: true,
          message: "Payment verified and orders updated",
          khaltiData,
          paymentOrder,
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "Payment verified", khaltiData });
    } catch (error) {
      console.error(
        "Khalti verify error:",
        error.response?.data || error.message,
      );
      if (req.body.paymentOrderId) {
        try {
          const po = await PaymentService.getPaymentOrderById(
            req.body.paymentOrderId,
          );
          if (po) {
            po.status = PaymentStatus.FAILED;
            await po.save();
          }
        } catch (_) {}
      }
      return res
        .status(400)
        .json({ success: false, error: error.response?.data || error.message });
    }
  }

  async initiateEsewaPayment(req, res) {
    const { orderId } = req.body;
    if (!orderId)
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });

    try {
      const paymentOrder = await PaymentService.getPaymentOrderById(orderId);

      // ✅ Ensure consistent 2 decimal format
      const amount = (paymentOrder.amount / 100).toFixed(2);
      const transactionUuid = `${orderId}__${Date.now()}`;

      // ✅ All three values must match exactly what's in formData
      const signatureMessage = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${ESEWA_CODE}`;
      const signature = crypto
        .createHmac("sha256", ESEWA_SECRET)
        .update(signatureMessage)
        .digest("base64");

      paymentOrder.paymentLinkId = transactionUuid;
      await paymentOrder.save();

      console.log("eSewa initiate:", {
        amount,
        transactionUuid,
        signatureMessage,
      }); // ← debug

      return res.status(200).json({
        success: true,
        esewaUrl: ESEWA_URL,
        formData: {
          amount: amount,
          tax_amount: "0",
          total_amount: amount, // ✅ must match signatureMessage exactly
          transaction_uuid: transactionUuid,
          product_code: ESEWA_CODE,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${FRONTEND}/payment/esewa-success`, // ✅ no paymentOrderId here
          failure_url: `${FRONTEND}/payment/esewa-failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature,
        },
      });
    } catch (error) {
      console.error("eSewa initiate error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async verifyEsewaPayment(req, res) {
    const { encodedData, paymentOrderId } = req.body;
    if (!encodedData) {
      return res
        .status(400)
        .json({ success: false, message: "encodedData is required" });
    }

    try {
      const decoded = JSON.parse(
        Buffer.from(encodedData, "base64").toString("utf-8"),
      );
      console.log("eSewa decoded →", decoded);

      if (decoded.status !== "COMPLETE") {
        return res.status(400).json({
          success: false,
          message: "eSewa payment not completed. Status: " + decoded.status,
        });
      }

      // ✅ Get paymentOrderId from body first, then fallback to transaction_uuid
      const resolvedOrderId =
        paymentOrderId || decoded.transaction_uuid?.split("__")[0];

      if (!resolvedOrderId) {
        return res.status(400).json({
          success: false,
          message: "Cannot resolve paymentOrderId",
        });
      }

      console.log("Resolved paymentOrderId →", resolvedOrderId);

      // ✅ Verify signature dynamically using signed_field_names
      const signedFields = decoded.signed_field_names.split(",");
      const sigMsg = signedFields.map((f) => `${f}=${decoded[f]}`).join(",");
      const expected = crypto
        .createHmac("sha256", ESEWA_SECRET)
        .update(sigMsg)
        .digest("base64");

      console.log("Signature check →", {
        expected,
        received: decoded.signature,
        match: expected === decoded.signature,
      });

      if (decoded.signature !== expected) {
        return res.status(400).json({
          success: false,
          message: "Signature mismatch — payment cannot be verified",
        });
      }

      await PaymentController._finalizePayment(
        resolvedOrderId,
        decoded.transaction_code,
        req.user,
      );

      const paymentOrder =
        await PaymentService.getPaymentOrderById(resolvedOrderId);
      return res.status(200).json({
        success: true,
        message: "eSewa payment verified successfully",
        paymentOrder,
      });
    } catch (error) {
      console.error("eSewa verify error:", error.message);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async _finalizePayment(paymentOrderId, txnId, user) {
    const paymentOrder =
      await PaymentService.getPaymentOrderById(paymentOrderId);

    if (paymentOrder.status === PaymentStatus.COMPLETED) {
      console.log("Payment already finalized, skipping:", paymentOrderId);
      return;
    }

    await paymentOrder.populate({
      path: "orders",
      populate: { path: "orderItems" },
    });
    paymentOrder.status = PaymentStatus.COMPLETED;
    paymentOrder.paymentLinkId = txnId;
    await paymentOrder.save();

    for (let ord of paymentOrder.orders) {
      const order = await OrderService.findOrderById(ord._id);
      order.paymentStatus = PaymentStatus.COMPLETED;
      await order.save();
      const transaction = await TransactionService.createTransaction(order._id);
      await SellerReportService.updateReportForTransaction(transaction);
    }

    if (user?.email) {
      await sendVerificationEmail(
        user.email,
        "Payment Successful - ToyVerse",
        `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#4f46e5;">ToyVerse</h2>
          <p>Your payment of <strong>Rs ${(paymentOrder.amount / 100).toLocaleString()}</strong> was successful!</p>
          <p>Order ID(s): ${paymentOrder.orders.map((o) => o._id).join(", ")}</p>
          <p>Thank you for shopping with ToyVerse! </p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;"/>
          <p style="color:#9ca3af;font-size:12px;">© ToyVerse. All rights reserved.</p>
        </div>`,
      );
    }
  }
}

module.exports = new PaymentController();
