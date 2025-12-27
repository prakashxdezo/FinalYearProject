import React, { useEffect } from "react";
import { CircularProgress, Chip } from "@mui/material";
import { fetchSellerReport } from "../../Redux Toolkit/features/seller/sellerSlice";
import { fetchSellerOrders } from "../../Redux Toolkit/features/seller/sellerOrderSlice";
import { fetchTransactionsBySeller } from "../../Redux Toolkit/features/seller/transactionSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const StatCard = ({ icon, title, value, subtitle, bg, iconBg }) => (
  <div
    className="rounded-xl p-5 flex items-start gap-4 shadow-sm border border-gray-100"
    style={{ background: bg || "#fff" }}
  >
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg || "#f3f4f6" }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const OrderStatusBadge = ({ label, count, color }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
    <p className="text-2xl font-bold" style={{ color }}>{count}</p>
    <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
  </div>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((store) => store.seller);
  const { orders = [] } = useAppSelector((store) => store.sellerOrder);
  const { transactions = [] } = useAppSelector((store) => store.transaction);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(fetchSellerReport(jwt));
    dispatch(fetchSellerOrders(jwt));
    dispatch(fetchTransactionsBySeller(jwt));
  }, []);

  const countBy = (status) => orders.filter((o) => o.orderStatus === status).length;
  const recentTx = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<AccountBalanceWalletIcon style={{ color: "#16a34a", fontSize: 22 }} />}
          title="Total Earnings"
          value={`Rs ${((report?.totalEarnings || 0) / 100).toLocaleString()}`}
          subtitle={`Net: Rs ${((report?.netEarnings || 0) / 100).toLocaleString()}`}
          iconBg="#dcfce7"
        />
        <StatCard
          icon={<TrendingUpIcon style={{ color: "#7c3aed", fontSize: 22 }} />}
          title="Total Sales"
          value={`Rs ${((report?.totalSales || 0) / 100).toLocaleString()}`}
          subtitle={`${report?.totalOrders || 0} orders`}
          iconBg="#ede9fe"
        />
        <StatCard
          icon={<ShoppingBagIcon style={{ color: "#2563eb", fontSize: 22 }} />}
          title="Transactions"
          value={report?.totalTransactions || 0}
          subtitle="Completed payments"
          iconBg="#dbeafe"
        />
      </div>

      {/* Order Status */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Order Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <OrderStatusBadge label="Pending" count={countBy("PENDING")} color="#f59e0b" />
          <OrderStatusBadge label="Shipped" count={countBy("SHIPPED")} color="#3b82f6" />
          <OrderStatusBadge label="Delivered" count={countBy("DELIVERED")} color="#16a34a" />
          <OrderStatusBadge label="Cancelled" count={countBy("CANCELLED")} color="#ef4444" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Recent Transactions</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {recentTx.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((t, i) => (
                  <tr key={t._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3 font-medium text-gray-700">{t.customer?.fullName || "Customer"}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3 font-bold text-green-600">
                      Rs {((t.order?.totalSellingPrice || 0) / 100).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <Chip
                        label={t.order?.orderStatus || "N/A"}
                        size="small"
                        color={
                          t.order?.orderStatus === "DELIVERED" ? "success" :
                          t.order?.orderStatus === "SHIPPED" ? "info" :
                          t.order?.orderStatus === "CANCELLED" ? "error" : "default"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-10 text-sm">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
