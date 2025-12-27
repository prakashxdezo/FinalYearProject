import { Chip, CircularProgress } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { useEffect } from "react";
import { fetchTransactionsBySeller } from "../../Redux Toolkit/features/seller/transactionSlice";

const statusColor = {
  COMPLETED: "success", PENDING: "warning", FAILED: "error",
  DELIVERED: "success", SHIPPED: "info", CANCELLED: "error", CONFIRMED: "primary",
};

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

export default function TransactionTable() {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((s) => s.transaction);

  useEffect(() => { dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt"))); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Transactions</h2>
        <span className="text-sm text-gray-400">{transactions?.length || 0} records</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><CircularProgress /></div>
      ) : !transactions?.length ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <ReceiptIcon style={{ color: "#d1d5db", fontSize: 56 }} />
          <p className="text-gray-400 mt-3 font-medium">No transactions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Date", "Customer", "Order ID", "Order Status", "Payment", "Amount"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(tx.date)}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-700">{tx.customer?.fullName || "N/A"}</p>
                      <p className="text-xs text-gray-400">{tx.customer?.email}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">
                      #{tx.order?._id?.slice(-8)?.toUpperCase() || "N/A"}
                    </td>
                    <td className="px-5 py-3">
                      <Chip label={tx.order?.orderStatus || "N/A"} color={statusColor[tx.order?.orderStatus] || "default"} size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                    </td>
                    <td className="px-5 py-3">
                      <Chip label={tx.order?.paymentStatus || "N/A"} color={statusColor[tx.order?.paymentStatus] || "default"} size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                    </td>
                    <td className="px-5 py-3 font-bold text-green-600 whitespace-nowrap">
                      Rs {((tx.order?.totalSellingPrice || 0) / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
