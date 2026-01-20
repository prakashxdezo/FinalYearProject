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
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingBag as ShoppingBagIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchTopProducts } from "../../Redux Toolkit/features/Admin/AdminSlice";

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

export default function TopProducts() {
  const dispatch = useAppDispatch();
  const { topProducts, topProductsLoading } = useAppSelector(
    (store) => store.admin,
  );
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    dispatch(fetchTopProducts({ limit: 20, period }));
  }, [dispatch, period]);

  const totalRevenue =
    topProducts?.reduce((sum, p) => sum + (p.totalRevenue || 0), 0) || 0;
  const totalSold =
    topProducts?.reduce((sum, p) => sum + (p.totalSold || 0), 0) || 0;

  const formatCurrency = (value) =>
    `₹${(value / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

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
            Top Products
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Products ranked by sales and revenue
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
          title="Total Units Sold"
          value={totalSold.toLocaleString()}
          color="#3b82f6"
          bgColor="#dbeafe"
        />
        <SummaryCard
          icon={<TrendingUpIcon sx={{ color: "#6366f1", fontSize: 22 }} />}
          title="Total Products"
          value={(topProducts?.length || 0).toLocaleString()}
          color="#6366f1"
          bgColor="#e0e7ff"
        />
      </Box>

      {/* Table */}
      {topProductsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !topProducts?.length ? (
        <Card sx={{ borderRadius: 3, p: 6, textAlign: "center" }}>
          <InventoryIcon sx={{ fontSize: 56, color: "#d1d5db", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
            No product data available
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Start processing orders to see top products
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
                    "Rank",
                    "Product",
                    "Category",
                    "Seller",
                    "Units Sold",
                    "Revenue",
                    "Status",
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
                {topProducts.map((product, index) => (
                  <TableRow
                    key={product.productId}
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
                          src={product.imageUrl}
                          variant="rounded"
                          sx={{
                            bgcolor: "#e0e7ff",
                            color: "#6366f1",
                            fontWeight: 700,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {!product.imageUrl &&
                            (product.productTitle?.charAt(0)?.toUpperCase() ||
                              "P")}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.productTitle}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            {formatCurrency(product.sellingPrice || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {product.category || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {product.sellerName || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {product.totalSold}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#16a34a" }}
                      >
                        {formatCurrency(product.totalRevenue)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status || "ACTIVE"}
                        size="small"
                        sx={{
                          bgcolor:
                            product.status === "ACTIVE" || !product.status
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            product.status === "ACTIVE" || !product.status
                              ? "#16a34a"
                              : "#ef4444",
                          fontWeight: 600,
                          fontSize: "0.7rem",
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
