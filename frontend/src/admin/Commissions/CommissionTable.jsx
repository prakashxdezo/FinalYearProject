import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchCommissionReport,
  markCommissionPaid,
} from "../../Redux Toolkit/features/Admin/AdminSlice";

const SummaryCard = ({ icon, title, value, color, bgColor }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #f0f0f0",
    }}
  >
    <CardContent sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ bgcolor: bgColor, width: 44, height: 44 }}>{icon}</Avatar>
      <Box>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function CommissionTable() {
  const dispatch = useAppDispatch();
  const { commissionReport, commissionLoading } = useAppSelector(
    (store) => store.admin,
  );
  const [period, setPeriod] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    sellerId: null,
    sellerName: "",
  });

  useEffect(() => {
    dispatch(fetchCommissionReport({ period }));
  }, [dispatch, period]);

  const formatCurrency = (value) =>
    `₹${(value / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const commissions = commissionReport?.commissions || [];
  const summary = commissionReport?.summary || {};

  const handleMarkPaid = (sellerId, sellerName) => {
    setConfirmDialog({ open: true, sellerId, sellerName });
  };

  const handleConfirmPaid = () => {
    if (confirmDialog.sellerId) {
      dispatch(markCommissionPaid({ sellerId: confirmDialog.sellerId })).then(
        () => {
          dispatch(fetchCommissionReport({ period }));
        },
      );
    }
    setConfirmDialog({ open: false, sellerId: null, sellerName: "" });
  };

  const periodOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
          >
            Commission Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Track and manage seller commissions
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {periodOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard
          icon={<AttachMoneyIcon sx={{ color: "#6366f1", fontSize: 22 }} />}
          title="Total Commission"
          value={formatCurrency(summary.total || 0)}
          color="#6366f1"
          bgColor="#e0e7ff"
        />
        <SummaryCard
          icon={<CheckCircleIcon sx={{ color: "#16a34a", fontSize: 22 }} />}
          title="Paid"
          value={formatCurrency(summary.paid || 0)}
          color="#16a34a"
          bgColor="#dcfce7"
        />
        <SummaryCard
          icon={<PendingIcon sx={{ color: "#f59e0b", fontSize: 22 }} />}
          title="Pending"
          value={formatCurrency(summary.unpaid || 0)}
          color="#f59e0b"
          bgColor="#fef3c7"
        />
      </Box>

      {/* Table */}
      {commissionLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !commissions.length ? (
        <Card sx={{ borderRadius: 3, p: 6, textAlign: "center" }}>
          <AccountBalanceIcon sx={{ fontSize: 56, color: "#d1d5db", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
            No commission data available
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Commissions will appear once orders are processed
          </Typography>
        </Card>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    "Seller",
                    "Business",
                    "Orders",
                    "Total Commission",
                    "Paid",
                    "Pending",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        color: "#64748b",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {commissions.map((item) => {
                  const isPending = (item.unpaidCommission || 0) > 0;
                  return (
                    <TableRow
                      key={item.sellerId}
                      sx={{
                        "&:hover": { bgcolor: "#f8fafc" },
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#e0e7ff",
                              color: "#6366f1",
                              fontWeight: 700,
                            }}
                          >
                            {item.sellerName?.charAt(0)?.toUpperCase() || "S"}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#1e293b" }}
                            >
                              {item.sellerName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#94a3b8" }}
                            >
                              {item.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {item.businessName || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {item.totalOrders || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#6366f1" }}
                        >
                          {formatCurrency(item.totalCommission || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#16a34a" }}
                        >
                          {formatCurrency(item.paidCommission || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: isPending ? "#f59e0b" : "#94a3b8",
                          }}
                        >
                          {formatCurrency(item.unpaidCommission || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isPending ? "Pending" : "Paid"}
                          size="small"
                          sx={{
                            bgcolor: isPending ? "#fef3c7" : "#dcfce7",
                            color: isPending ? "#f59e0b" : "#16a34a",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleMarkPaid(item.sellerId, item.sellerName)
                            }
                            sx={{
                              bgcolor: "#6366f1",
                              color: "#fff",
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              "&:hover": { bgcolor: "#4f46e5" },
                            }}
                          >
                            Mark Paid
                          </Button>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, sellerId: null, sellerName: "" })
        }
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Confirm Payment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Mark all pending commissions as paid for{" "}
            <strong>{confirmDialog.sellerName}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, sellerId: null, sellerName: "" })
            }
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPaid}
            variant="contained"
            sx={{
              bgcolor: "#6366f1",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
