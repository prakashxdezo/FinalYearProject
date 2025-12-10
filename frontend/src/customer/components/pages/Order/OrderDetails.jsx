import { Box, Button, Divider } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import OrderStepper from "./OrderStepper";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import {
  cancelOrder,
  fetchOrderById,
  fetchUserOrderHistory,
  fetchOrderItemById,
} from "../../../../Redux Toolkit/features/customer/orderSlice";
import { useParams } from "react-router";

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const { orderItemId, orderId } = useParams();

  const { orderItem, currentOrder } = useAppSelector((store) => store.order);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    if (orderId) dispatch(fetchOrderById({ jwt, orderId }));
    if (orderItemId) dispatch(fetchOrderItemById({ jwt, orderItemId }));
  }, [orderId, orderItemId]);

  const discount = useMemo(() => {
    if (!orderItem) return 0;
    const mrp = (orderItem.mrpPrice || 0) / 100;
    const selling = (orderItem.sellingPrice || 0) / 100;
    return mrp - selling;
  }, [orderItem]);


  const paymentStatus = currentOrder?.paymentStatus;
  const isOnlinePaid =
    paymentStatus === "COMPLETED" || paymentStatus === "completed";
  const isCOD =
    paymentStatus === "PROCESSING" ||
    paymentStatus === "processing" ||
    paymentStatus === "PENDING" ||
    paymentStatus === "pending";

  const PaymentBadge = () => {
    if (isOnlinePaid) {
      return (
        <div className="bg-green-50 px-5 py-2 text-xs font-medium flex items-center gap-3 text-green-700 rounded">
          <CheckCircleIcon sx={{ fontSize: "16px", color: "green" }} />
          <div>
            <p className="font-semibold">Paid Online via Esewa</p>
            <p className="text-green-500">Payment Successful</p>
          </div>
        </div>
      );
    }

    if (isCOD) {
      return (
        <div className="bg-sky-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded">
          <PaymentIcon sx={{ fontSize: "16px" }} />
          <div>
            <p className="font-semibold">Cash on Delivery</p>
            <p className="text-gray-500">Pay when your order arrives</p>
          </div>
        </div>
      );
    }

    // fallback
    return (
      <div className="bg-gray-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded">
        <CreditCardIcon sx={{ fontSize: "16px" }} />
        <p>Payment Pending</p>
      </div>
    );
  };

  
  const sellerName =
    currentOrder?.seller?.businessName ||
    currentOrder?.seller?.name ||
    currentOrder?.seller?.email ||
    "Unknown Seller";

  return (
    <Box className="space-y-5">
      {/* Product preview */}
      <section className="flex flex-col gap-5 justify-center items-center">
        <img
          className="w-[100px]"
          src={orderItem?.product?.images?.[0] || "/images/placeholder.jpg"}
          alt="product"
        />
        <div className="text-sm space-y-1 text-center">
          <h1 className="font-semibold">
            {orderItem?.product?.title || "Product"}
          </h1>
          <p>{orderItem?.product?.description || ""}</p>
          <p>Size: {orderItem?.size || "N/A"}</p>
        </div>
      </section>

      {/* Order stepper */}
      <section className="border border-gray-200 p-5">
        <OrderStepper orderStatus={currentOrder?.orderStatus} />
      </section>

      {/* Delivery Address */}
      <section className="border border-gray-200 p-5">
        <h1 className="font-bold pb-3">Delivery Address</h1>
        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{currentOrder?.shippingAddress?.name || "N/A"}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder?.shippingAddress?.mobile || "N/A"}</p>
          </div>
          <p>
            {currentOrder?.shippingAddress?.address || "N/A"},{" "}
            {currentOrder?.shippingAddress?.locality || ""},{" "}
            {currentOrder?.shippingAddress?.city || ""},{" "}
            {currentOrder?.shippingAddress?.state || ""},{" "}
            {currentOrder?.shippingAddress?.pincode || ""}
          </p>
        </div>
      </section>

      {/* Price Summary */}
      <section className="border border-gray-200 space-y-4">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p className="font-black">Total Item Price</p>
            <p>
              You saved <span className="text-green-400">Rs {discount}</span> on
              this item
            </p>
          </div>
          <p>Rs {(currentOrder?.totalSellingPrice || 0) / 100}</p>
        </div>

        {/* Dynamic payment badge */}
        <div className="px-5 pb-4">
          <PaymentBadge />
        </div>

        {/* Seller name — dynamic */}
        <div className="px-5 pb-5">
          <p className="text-xs">
            <strong>Sold by:</strong>{" "}
            <span className="text-blue-600">{sellerName}</span>
          </p>
        </div>

        {/* Cancel Order Button */}
        <div className="p-10">
          <Button
            fullWidth
            variant="outlined"
            disabled={
              currentOrder?.orderStatus === "CANCELLED" ||
              currentOrder?.orderStatus === "DELIVERED"
            }
            onClick={async () => {
              if (!currentOrder?._id) return;
              try {
                await dispatch(
                  cancelOrder({
                    orderId: currentOrder._id,
                    jwt: localStorage.getItem("jwt"),
                  }),
                ).unwrap();
                alert("Order cancelled successfully!");
                dispatch(fetchUserOrderHistory(localStorage.getItem("jwt")));
              } catch (err) {
                alert("Failed to cancel order");
              }
            }}
          >
            {currentOrder?.orderStatus === "CANCELLED"
              ? "Order Cancelled"
              : "Cancel Order"}
          </Button>
        </div>
      </section>
    </Box>
  );
};

export default OrderDetails;
