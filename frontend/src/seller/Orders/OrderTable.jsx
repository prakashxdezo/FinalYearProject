import React, { useEffect } from "react";
import { Chip, Menu, MenuItem, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../Redux Toolkit/features/seller/sellerOrderSlice";

const orderStatusList = [
  { label: "PENDING", color: "#f59e0b" },
  { label: "PLACED", color: "#6366f1" },
  { label: "CONFIRMED", color: "#3b82f6" },
  { label: "SHIPPED", color: "#0ea5e9" },
  { label: "DELIVERED", color: "#16a34a" },
  { label: "CANCELLED", color: "#ef4444" },
];

const statusChipColor = {
  PENDING: "warning",
  PLACED: "default",
  CONFIRMED: "primary",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "error",
};

export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((store) => store.sellerOrder);

  // ✅ FIX 1: Use a single state variable instead of an object map
  // to avoid stale closure issues with anchorEl
  const [menuState, setMenuState] = React.useState({
    anchorEl: null,
    orderId: null,
  });

  const handleMenuOpen = (e, id) => {
    // ✅ FIX 2: Prevent event from bubbling and use currentTarget correctly
    e.stopPropagation();
    setMenuState({ anchorEl: e.currentTarget, orderId: id });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, orderId: null });
  };

  const handleUpdate = async (orderId, status) => {
    // ✅ FIX 3: Close menu FIRST before dispatching to avoid UI flicker
    handleMenuClose();

    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      console.error("No JWT token found");
      return;
    }

    if (!orderId) {
      console.error("No orderId provided");
      return;
    }

    try {
      // ✅ FIX 4: unwrap() lets you catch errors from rejected thunks
      await dispatch(
        updateOrderStatus({
          orderId,
          orderStatus: status, // keep your existing key name
          jwt,
        }),
      ).unwrap();

      // ✅ FIX 5: Refetch only after successful update
      dispatch(fetchSellerOrders(jwt));
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(fetchSellerOrders(jwt));
  }, [dispatch]); // ✅ FIX 6: Add dispatch to dependency array

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Orders</h2>
        <span className="text-sm text-gray-400">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <LocalShippingIcon style={{ color: "#d1d5db", fontSize: 56 }} />
          <p className="text-gray-400 mt-3 font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Products
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  // ✅ FIX 7: Support both `_id` (MongoDB) and `id` (some APIs)
                  const orderId = order._id || order.id;

                  return (
                    <tr
                      key={orderId}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-500 align-top">
                        #{orderId?.slice(-8).toUpperCase()}
                      </td>

                      <td className="px-5 py-3 align-top">
                        <div className="space-y-2">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={item.product?.images?.[0]}
                                alt=""
                                className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50"
                              />
                              <div>
                                <p className="font-medium text-gray-700 line-clamp-1 max-w-[160px]">
                                  {item.product?.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-3 text-xs text-gray-500 align-top max-w-[180px]">
                        {[
                          order.shippingAddress?.address,
                          order.shippingAddress?.locality,
                          order.shippingAddress?.city,
                          order.shippingAddress?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>

                      <td className="px-5 py-3 font-bold text-gray-800 align-top whitespace-nowrap">
                        Rs{" "}
                        {(
                          (order.totalSellingPrice || 0) / 100
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-3 align-top">
                        <Chip
                          label={order.orderStatus}
                          color={
                            statusChipColor[order.orderStatus] || "default"
                          }
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                        />
                      </td>

                      <td className="px-5 py-3 align-top">
                        <button
                          onClick={(e) => handleMenuOpen(e, orderId)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Update{" "}
                          <KeyboardArrowDownIcon style={{ fontSize: 14 }} />
                        </button>

                        {/* ✅ FIX 8: Single shared Menu, rendered outside the map loop logic
                            by checking if this row's orderId matches the open menu's orderId */}
                        <Menu
                          anchorEl={
                            menuState.orderId === orderId
                              ? menuState.anchorEl
                              : null
                          }
                          open={
                            menuState.orderId === orderId &&
                            Boolean(menuState.anchorEl)
                          }
                          onClose={handleMenuClose}
                          PaperProps={{
                            sx: {
                              borderRadius: "10px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          {orderStatusList.map((s) => (
                            <MenuItem
                              key={s.label}
                              onClick={() => handleUpdate(orderId, s.label)}
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: s.color,
                                gap: 1,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  background: s.color,
                                  display: "inline-block",
                                }}
                              />
                              {s.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
