import { Card, Divider, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import TransactionTable from "../Transaction/TransactionTable";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchSellerReport } from "../../Redux Toolkit/features/seller/sellerSlice";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RefundIcon from "@mui/icons-material/MoneyOff";

const Payment = () => {
  const dispatch = useAppDispatch();
  const { report, loading } = useAppSelector((store) => store.seller);

  useEffect(() => {
    dispatch(fetchSellerReport(localStorage.getItem("jwt")));
  }, []);

  const totalEarnings = (report?.totalEarnings || 0) / 100;
  const netEarnings = (report?.netEarnings || 0) / 100;
  const totalRefunds = (report?.totalRefunds || 0) / 100;
  const totalTransactions = report?.totalTransactions || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-gray-500">
            <AccountBalanceWalletIcon fontSize="small" />
            <p className="text-sm">Total Earnings</p>
          </div>
          <h1 className="font-bold text-2xl text-green-600">
            Rs {totalEarnings.toLocaleString()}
          </h1>
          <Divider />
          <p className="text-xs text-gray-500">
            Net:{" "}
            <strong className="text-green-500">
              Rs {netEarnings.toLocaleString()}
            </strong>
          </p>
        </Card>

        <Card className="p-5 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-gray-500">
            <ReceiptIcon fontSize="small" />
            <p className="text-sm">Total Transactions</p>
          </div>
          <h1 className="font-bold text-2xl text-blue-600">
            {totalTransactions}
          </h1>
          <Divider />
          <p className="text-xs text-gray-500">Completed payments</p>
        </Card>

        <Card className="p-5 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-gray-500">
            <TrendingUpIcon fontSize="small" />
            <p className="text-sm">Total Sales</p>
          </div>
          <h1 className="font-bold text-2xl text-purple-600">
            Rs {((report?.totalSales || 0) / 100).toLocaleString()}
          </h1>
          <Divider />
          <p className="text-xs text-gray-500">
            Orders: <strong>{report?.totalOrders || 0}</strong>
          </p>
        </Card>

        <Card className="p-5 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-gray-500">
            <RefundIcon fontSize="small" />
            <p className="text-sm">Refunds</p>
          </div>
          <h1 className="font-bold text-2xl text-red-500">
            Rs {totalRefunds.toLocaleString()}
          </h1>
          <Divider />
          <p className="text-xs text-gray-500">
            Cancelled: <strong>{report?.canceledOrders || 0}</strong>
          </p>
        </Card>
      </div>

      {/* Transaction Table */}
      <TransactionTable />
    </div>
  );
};

export default Payment;
