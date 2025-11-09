import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/home";
const ADMIN_URL = "/admin";

// ============ HOME CATEGORY ============
export const updateHomeCategory = createAsyncThunk(
  "/homeCategory/updateHomeCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/home-category/${id}`, data);
      console.log("update home category", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const fetchHomeCategory = createAsyncThunk(
  "/homeCategory/fetchHomeCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/home-category`);
      console.log("fetch home category", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

// ============ DASHBOARD STATS ============
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_URL}/stats`);
      console.log("fetch dashboard stats", response.data);
      return response.data;
    } catch (error) {
      console.log("error fetching dashboard stats", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ============ TOP SELLERS ============
export const fetchTopSellers = createAsyncThunk(
  "admin/fetchTopSellers",
  async ({ limit = 10, period = "all" }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_URL}/top-sellers`, {
        params: { limit, period },
      });
      console.log("fetch top sellers", response.data);
      return response.data;
    } catch (error) {
      console.log("error fetching top sellers", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ============ TOP PRODUCTS ============
export const fetchTopProducts = createAsyncThunk(
  "admin/fetchTopProducts",
  async ({ limit = 10, period = "all" }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_URL}/top-products`, {
        params: { limit, period },
      });
      console.log("fetch top products", response.data);
      return response.data;
    } catch (error) {
      console.log("error fetching top products", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ============ COMMISSION REPORT ============
export const fetchCommissionReport = createAsyncThunk(
  "admin/fetchCommissionReport",
  async ({ status = "all", page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_URL}/commissions`, {
        params: { status, page, limit },
      });
      console.log("fetch commission report", response.data);
      return response.data;
    } catch (error) {
      console.log("error fetching commission report", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const markCommissionPaid = createAsyncThunk(
  "admin/markCommissionPaid",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${ADMIN_URL}/commissions/${orderId}/pay`,
      );
      console.log("mark commission paid", response.data);
      return response.data;
    } catch (error) {
      console.log("error marking commission paid", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ============ REVENUE ANALYTICS ============
export const fetchRevenueAnalytics = createAsyncThunk(
  "admin/fetchRevenueAnalytics",
  async (period = "month", { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_URL}/revenue-analytics`, {
        params: { period },
      });
      console.log("fetch revenue analytics", response.data);
      return response.data;
    } catch (error) {
      console.log("error fetching revenue analytics", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ============ INITIAL STATE ============
const initialState = {
  // Home category
  categories: [],

  // Dashboard stats
  stats: null,

  // Top sellers
  topSellers: [],

  // Top products
  topProducts: [],

  // Commissions
  commissions: [],
  commissionPagination: null,
  commissionTotals: null,

  // Revenue analytics
  revenueAnalytics: [],

  // Loading states
  loading: false,
  statsLoading: false,
  topSellersLoading: false,
  topProductsLoading: false,
  commissionsLoading: false,

  // Error
  error: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ============ HOME CATEGORY ============
    builder
      .addCase(fetchHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.code?.message || action.error.message;
      });

    // ============ DASHBOARD STATS ============
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = "";
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // ============ TOP SELLERS ============
    builder
      .addCase(fetchTopSellers.pending, (state) => {
        state.topSellersLoading = true;
        state.error = "";
      })
      .addCase(fetchTopSellers.fulfilled, (state, action) => {
        state.topSellersLoading = false;
        state.topSellers = action.payload;
      })
      .addCase(fetchTopSellers.rejected, (state, action) => {
        state.topSellersLoading = false;
        state.error = action.payload;
      });

    // ============ TOP PRODUCTS ============
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.topProductsLoading = true;
        state.error = "";
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.error = action.payload;
      });

    // ============ COMMISSION REPORT ============
    builder
      .addCase(fetchCommissionReport.pending, (state) => {
        state.commissionsLoading = true;
        state.error = "";
      })
      .addCase(fetchCommissionReport.fulfilled, (state, action) => {
        state.commissionsLoading = false;
        state.commissions = action.payload.commissions;
        state.commissionPagination = action.payload.pagination;
        state.commissionTotals = action.payload.totals;
      })
      .addCase(fetchCommissionReport.rejected, (state, action) => {
        state.commissionsLoading = false;
        state.error = action.payload;
      })
      .addCase(markCommissionPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(markCommissionPaid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.commissions.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) {
          state.commissions[index] = action.payload;
        }
      })
      .addCase(markCommissionPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============ REVENUE ANALYTICS ============
    builder
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueAnalytics = action.payload;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
