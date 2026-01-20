import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingBag as ShoppingBagIcon,
  AccountBalance as AccountBalanceIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { fetchDashboardStats } from "../../Redux Toolkit/features/Admin/AdminSlice";

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color, bgColor }) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: "1px solid #f0f0f0",
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              mb: 0.5,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: bgColor, width: 48, height: 48 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

// Commission Progress Card
const CommissionCard = ({ stats, loading }) => {
  if (loading) return <CircularProgress size={24} />;

  const { paid, unpaid, total } = stats?.commissions || {
    paid: 0,
    unpaid: 0,
    total: 0,
  };
  const paidPercentage = total > 0 ? (paid / total) * 100 : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
      }}
    >
 
    </Card>
  );
};

// Orders Status Card
const OrdersStatusCard = ({ stats, loading }) => {
  if (loading) return <CircularProgress size={24} />;

  const orderStatus = stats?.orders?.byStatus || {};
  const statusColors = {
    PENDING: { bg: "#fef3c7", color: "#f59e0b" },
    PLACED: { bg: "#dbeafe", color: "#3b82f6" },
    CONFIRMED: { bg: "#dbeafe", color: "#3b82f6" },
    SHIPPED: { bg: "#e0e7ff", color: "#6366f1" },
    DELIVERED: { bg: "#ecfdf5", color: "#16a34a" },
    CANCELLED: { bg: "#fee2e2", color: "#ef4444" },
  };

  const statusLabels = {
    PENDING: "Pending",
    PLACED: "Placed",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ShoppingBagIcon sx={{ color: "#6366f1" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Orders by Status
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {Object.entries(orderStatus).map(([status, count]) => (
            <Chip
              key={status}
              label={`${statusLabels[status] || status}: ${count}`}
              size="small"
              sx={{
                bgcolor: statusColors[status]?.bg || "#f1f5f9",
                color: statusColors[status]?.color || "#64748b",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          ))}
          {Object.keys(orderStatus).length === 0 && (
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              No orders yet
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function AdminHome() {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector((store) => store.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Format currency
  const formatCurrency = (value) => {
    return `\u20b9${(value / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  if (statsLoading && !stats) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ space: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Welcome back! Here's what's happening with your platform.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.users?.total?.toLocaleString() || 0}
            subtitle="Registered customers"
            icon={<PeopleIcon sx={{ color: "#6366f1" }} />}
            color="#6366f1"
            bgColor="#e0e7ff"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sellers"
            value={stats?.sellers?.total?.toLocaleString() || 0}
            subtitle={`${stats?.sellers?.active || 0} active, ${stats?.sellers?.pending || 0} pending`}
            icon={<StoreIcon sx={{ color: "#16a34a" }} />}
            color="#16a34a"
            bgColor="#dcfce7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.revenue?.total || 0)}
            subtitle="From all orders"
            icon={<AttachMoneyIcon sx={{ color: "#f59e0b" }} />}
            color="#f59e0b"
            bgColor="#fef3c7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.orders?.total?.toLocaleString() || 0}
            subtitle="All time orders"
            icon={<ShoppingBagIcon sx={{ color: "#3b82f6" }} />}
            color="#3b82f6"
            bgColor="#dbeafe"
          />
        </Grid>
      </Grid>

      {/* Commission & Orders Status */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CommissionCard stats={stats} loading={statsLoading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrdersStatusCard stats={stats} loading={statsLoading} />
        </Grid>
      </Grid>

      {/* Quick Stats Row */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <CardContent
              sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar sx={{ bgcolor: "#ecfdf5", width: 40, height: 40 }}>
                <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Active Sellers
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {stats?.sellers?.active || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <CardContent
              sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar sx={{ bgcolor: "#fef3c7", width: 40, height: 40 }}>
                <PendingIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Pending Verification
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {stats?.sellers?.pending || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <CardContent
              sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar sx={{ bgcolor: "#e0e7ff", width: 40, height: 40 }}>
                <TrendingUpIcon sx={{ color: "#6366f1", fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Total Commission
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {formatCurrency(stats?.commissions?.total || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
