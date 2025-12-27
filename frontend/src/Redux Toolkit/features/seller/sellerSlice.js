import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";



const initialState = {
  sellers: [],
  selectedSeller: null,
  loading: false,
  error: null,
  profile: null,
  report: null,
  profileUpdated: false,
};

const API_URL = "/sellers";

export const fetchSellerProfile = createAsyncThunk(
  "sellers/fetchSellerProfile",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("fetch seller profile", response.data);
      return response.data;
    } catch (error) {
      console.log("Fetch seller profile error", error);
      return rejectWithValue("Failed to fetch seller profile");
    }
  },
);

export const fetchSellers = createAsyncThunk(
  "sellers/fetchSellers",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        params: { status },
      });
      console.log("fetch sellers", response.data);
      return response.data;
    } catch (error) {
      console.error("fetch sellers error:", error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSellerReport = createAsyncThunk(
  "sellers/fetchSellerReport",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/seller/report`, {
        // ✅ FIX: was /api/seller/report — api instance already has baseURL
        // so /api was being doubled → /api/api/seller/report
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("fetch seller report", response.data);
      return response.data;
    } catch (error) {
      console.log("fetch seller report error", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchSellerById = createAsyncThunk(
  "sellers/fetchSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.log("fetch seller by id error", error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateSellerAccountStatus = createAsyncThunk(
  "seller/updateAccountStatus",
  async ({ id, status, jwt }, { rejectWithValue }) => {
    try {
      // ✅ FIX: Use api instance instead of raw axios
      // Raw axios was using localhost:5173 (Vite) as base → 404
      // api instance uses your configured baseURL (localhost:8081)
      // ✅ FIX: Route is /sellers/:id/status (no /api prefix)
      // api instance already has the baseURL with /api if needed
      const { data } = await api.patch(
        `${API_URL}/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update seller status",
      );
    }
  },
);

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdated = false;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sellers";
      })

      .addCase(fetchSellerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSeller = action.payload;
      })
      .addCase(fetchSellerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch seller";
      })

      .addCase(updateSellerAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerAccountStatus.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Update seller in list immediately without refetch
        const index = state.sellers.findIndex(
          (seller) =>
            (seller._id || seller.id) ===
            (action.payload._id || action.payload.id),
        );
        if (index !== -1) {
          state.sellers[index] = action.payload;
        }
      })
      .addCase(updateSellerAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update seller";
      })

      .addCase(fetchSellerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSellerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerSlice.reducer;
