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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchTopSellers } from "../../Redux Toolkit/features/Admin/AdminSlice";

// Summary Card
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

// Rank Badge
const RankBadge = ({ rank }) => {
  const colors = {
    1: { bg: "#fef3c7", color: "#f59e0b", border: "#fbbf24" },
    2: { bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" },
    3: { bg: "#ffedd5", color: "#ea580c", border: "#fb923c" },
  };
  const style = colors[rank] || {
    bg: "#f8fafc",
    color: "#64748b",
    border: "#e2e8f0",
  };

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: "0.875rem",
        border: `2px solid ${style.border}`,
      }}
    >
      {rank}
    </Box>
  );
};

export default function TopSellers() {
  const dispatch = useAppDispatch();
  const { topSellers, topSellersLoading } = useAppSelector(
    (store) => store.admin,
  );
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    dispatch(fetchTopSellers({ limit: 20, period }));
  }, [dispatch, period]);

  // Calculate totals
  const totalRevenue = topSellers.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalOrders = topSellers.reduce((sum, s) => sum + s.totalOrders, 0);
  const totalCommission = topSellers.reduce(
    (sum, s) => sum + s.totalCommission,
    0,
  );

  // Format currency
  const formatCurrency = (value) => {
    return `\u20b9${(value / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const periodOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  return (
    <Box sx={{ space: 4 }}>
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
            Top Sellers
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Sellers ranked by revenue and performance
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
          icon={<AttachMoneyIcon sx={{ color: "#16a34a", fontSize: 22 }} />}
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          color="#16a34a"
          bgColor="#dcfce7"
        />
        <SummaryCard
          icon={<ShoppingBagIcon sx={{ color: "#3b82f6", fontSize: 22 }} />}
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          color="#3b82f6"
          bgColor="#dbeafe"
        />
        <SummaryCard
          icon={<TrendingUpIcon sx={{ color: "#6366f1", fontSize: 22 }} />}
          title="Total Commission"
          value={formatCurrency(totalCommission)}
          color="#6366f1"
          bgColor="#e0e7ff"
        />
      </Box>

      {/* Table */}
      {topSellersLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : topSellers.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: 6, textAlign: "center" }}>
          <StoreIcon sx={{ fontSize: 56, color: "#d1d5db", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
            No seller data available
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Start processing orders to see top sellers
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
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Rank
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Seller
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Business
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Orders
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Revenue
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Commission
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#64748b",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topSellers.map((seller, index) => (
                  <TableRow
                    key={seller.sellerId}
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <TableCell>
                      <RankBadge rank={index + 1} />
                    </TableCell>
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
                          {seller.sellerName?.charAt(0)?.toUpperCase() || "S"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {seller.sellerName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            {seller.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {seller.businessName || "\u2014"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {seller.totalOrders}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                        {seller.totalItems} items
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#16a34a" }}
                      >
                        {formatCurrency(seller.totalRevenue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#6366f1" }}
                      >
                        {formatCurrency(seller.totalCommission)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={seller.accountStatus?.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          bgcolor:
                            seller.accountStatus === "ACTIVE"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            seller.accountStatus === "ACTIVE"
                              ? "#16a34a"
                              : "#f59e0b",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
