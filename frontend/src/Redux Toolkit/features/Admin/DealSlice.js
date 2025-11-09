import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  deals: [],
  loading: false,
  error: "",
};

export const createDeal = createAsyncThunk(
  "deal/createDeal",
  async (deal, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/deals`, deal);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getAllDeals = createAsyncThunk(
  "deal/getAllDeals",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ public route — works for both customers and admin
      const response = await api.get(`/api/deals`);
      console.log("get all deals", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteDeal = createAsyncThunk(
  "deal/deleteDeal",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/deals/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateDeal = createAsyncThunk(
  "deal/updateDeal",
  async ({ id, deal }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/deals/${id}`, deal);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(getAllDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = state.deals.filter((deal) => deal._id !== action.payload);
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex(
          (deal) => deal._id === action.payload._id,
        );
        if (index !== -1) state.deals[index] = action.payload;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dealSlice.reducer;
