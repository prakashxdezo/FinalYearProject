import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/api/coupons";

// APPLY COUPON
export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}/apply`,
        { apply, code, orderValue }, 
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );

      console.log("apply coupon", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to apply coupon",
      );
    }
  },
);

// INITIAL STATE (JS VERSION)
const initialState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false,
};

// SLICE
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponApplied = true;
        state.cart = action.payload; // updated cart total
      })
      
  },
});

export default couponSlice.reducer;
