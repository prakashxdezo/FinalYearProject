import { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  Chip,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import {
  fetchSellers,
  updateSellerAccountStatus,
} from "../../Redux Toolkit/features/seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";

const accountStatuses = [
  {
    status: "PENDING_VERIFICATION",
    title: "Pending Verification",
    color: "#f59e0b",
  },
  { status: "ACTIVE", title: "Active", color: "#16a34a" },
  { status: "SUSPENDED", title: "Suspended", color: "#f97316" },
  { status: "DEACTIVATED", title: "Deactivated", color: "#6b7280" },
  { status: "BANNED", title: "Banned", color: "#ef4444" },
  { status: "CLOSED", title: "Closed", color: "#374151" },
];

const statusChip = {
  ACTIVE: "success",
  PENDING_VERIFICATION: "warning",
  SUSPENDED: "warning",
  DEACTIVATED: "default",
  BANNED: "error",
  CLOSED: "default",
};

export default function SellerTable() {
  const dispatch = useAppDispatch();
  const { sellers = [], loading } = useAppSelector((store) => store.seller);
  const [filterStatus, setFilterStatus] = useState("PENDING_VERIFICATION");

  // ✅ FIX 1: Track which seller is currently being updated
  // so we can show a per-row loading spinner and prevent double clicks
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ FIX 2: Feedback snackbar so admin knows if update succeeded or failed
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchSellers(filterStatus));
  }, [filterStatus, dispatch]);

  const handleStatusChange = async (sellerId, newStatus) => {
    const jwt = localStorage.getItem("jwt");

    // ✅ FIX 3: Guard — never fire without a token
    if (!jwt) {
      setSnack({
        open: true,
        message: "Session expired. Please log in again.",
        severity: "error",
      });
      return;
    }

    setUpdatingId(sellerId);

    try {
      // ✅ FIX 4: .unwrap() surfaces backend errors instead of silently swallowing them
      await dispatch(
        updateSellerAccountStatus({
          id: sellerId,
          status: newStatus,
          jwt,
        }),
      ).unwrap();

      setSnack({
        open: true,
        message: "Seller status updated successfully.",
        severity: "success",
      });

      // ✅ FIX 5: Refetch the current filtered list so UI stays consistent
      dispatch(fetchSellers(filterStatus));
    } catch (err) {
      console.error("Failed to update seller status:", err);
      setSnack({
        open: true,
        message: err?.message || "Failed to update status. Please try again.",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Feedback Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          sx={{ fontWeight: 600 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <PeopleIcon style={{ color: "#4f46e5" }} />
          <h2 className="text-lg font-bold text-gray-800">Sellers</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {sellers.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter by status:</span>
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 200, borderRadius: "8px", fontSize: "0.85rem" }}
          >
            {accountStatuses.map((s) => (
              <MenuItem
                key={s.status}
                value={s.status}
                sx={{ fontSize: "0.85rem" }}
              >
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      ) : sellers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <PeopleIcon style={{ color: "#d1d5db", fontSize: 56 }} />
          <p className="text-gray-400 mt-3 font-medium">
            No sellers with this status
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Seller",
                    "Email",
                    "Mobile",
                    "Business",
                    "Status",
                    "Change Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellers.map((item, i) => {
                  // ✅ FIX 6: Support both _id (MongoDB) and id (Spring Boot / REST APIs)
                  const sellerId = item._id || item.id;
                  const isUpdating = updatingId === sellerId;

                  return (
                    <tr
                      key={sellerId}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#e0e7ff",
                              color: "#4f46e5",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            {item.sellerName?.charAt(0)?.toUpperCase() || "S"}
                          </Avatar>
                          <span className="font-semibold text-gray-700">
                            {item.sellerName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-gray-500">{item.email}</td>
                      <td className="px-5 py-3 text-gray-500">{item.mobile}</td>
                      <td className="px-5 py-3 font-medium text-gray-700">
                        {item.businessDetails?.businessName || "—"}
                      </td>

                      <td className="px-5 py-3">
                        <Chip
                          label={item.accountStatus?.replace(/_/g, " ")}
                          color={statusChip[item.accountStatus] || "default"}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                        />
                      </td>

                      <td className="px-5 py-3">
                        {/* ✅ FIX 7: Show spinner in the select while this row is updating */}
                        {isUpdating ? (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CircularProgress size={16} />
                            <span>Updating…</span>
                          </div>
                        ) : (
                          <Select
                            size="small"
                            // ✅ FIX 8: Controlled value — always reflects current DB status
                            value={item.accountStatus}
                            // ✅ FIX 9: Dedicated handler with proper async/await + error handling
                            onChange={(e) =>
                              handleStatusChange(sellerId, e.target.value)
                            }
                            // ✅ FIX 10: Disabled while any row is being updated to prevent race conditions
                            disabled={updatingId !== null}
                            sx={{ minWidth: 160, fontSize: "0.8rem" }}
                          >
                            {accountStatuses.map((s) => (
                              <MenuItem
                                key={s.status}
                                value={s.status}
                                sx={{
                                  fontSize: "0.8rem",
                                  color: s.color,
                                  fontWeight: 600,
                                }}
                              >
                                {s.title}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
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
