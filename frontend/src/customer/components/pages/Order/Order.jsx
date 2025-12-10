import React, { useEffect } from "react";
import OrderItemCard from "./OrderItemCard";
import { useNavigate } from "react-router";
import store, {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { fetchUserOrderHistory } from "../../../../Redux Toolkit/features/customer/orderSlice";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector((store) => store.order);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt")));
  }, []);
  return (
    <div className="text-sm min-h-screen">
      <div className="pb-5">
        <h1 className="font-semibold"> All orders </h1>
        <p>From anytime</p>
      </div>
      <div className="space-y-2">
        {order.orders.map((order, index) =>
          order?.orderItems.map((orderItem, index) => (
            <OrderItemCard orderItem={orderItem} order={order} key={orderItem._id} />
          )),
        )}
      </div>
    </div>
  );
};

export default Order;
