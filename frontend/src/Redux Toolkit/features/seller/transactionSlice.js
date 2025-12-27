import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactionsBySeller = createAsyncThunk(
  "transaction/fetchTransactionsBySeller",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions/seller`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      console.log("fetch transaction by seller", response.data);

      return response.data;
    } catch (error) {
      console.log("error", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch transactions",
      );
    }
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTransactionsBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })

      .addCase(fetchTransactionsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
