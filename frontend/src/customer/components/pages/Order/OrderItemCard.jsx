import { Avatar } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import React from "react";
import { useNavigate } from "react-router";

const OrderItemCard = ({ orderItem, order }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/account/orders/${order._id}/item/${orderItem._id}`)
      }
      className="text-sm bg-white p-5 space-y-4 border border-gray-200 rounded-md cursor-pointer "
    >
      <div className="flex items-center gap-3">
        <div>
          <Avatar sizes="small" sx={{ bgcolor: "#00927c" }}>
            <ReceiptLongIcon />
          </Avatar>
        </div>
        <div>
          <h1 className="font-bold hover:bg-sky-200">{order.orderStatus}</h1>
          <p>Arriving by {order.deliveryDate}</p>
        </div>
      </div>

      <div className="p-5 bg-sky-50 flex gap-3">
        <div>
          <img
            className="w-[70px]"
            src={orderItem.product?.images?.[0] || orderItem.image} // fallback if product.images missing
            alt={orderItem.title}
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className="font-bold">
            {orderItem.product?.title || orderItem.title}
          </h1>
          <p>{orderItem.product?.description || orderItem.description}</p>
          <p>
            <strong>size : </strong> {orderItem.size || "FREE"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
