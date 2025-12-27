import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  otpSent: false,
  jwt: null,
  error: null,
  loading: false,
};

const API_URL = "/sellers";

export const sendLoginOtp = createAsyncThunk(
  "sellerAuth/sendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/send/login-otp`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to send OTP.",
      );
    }
  },
);

export const verifyLoginOtp = createAsyncThunk(
  "sellerAuth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/verify/login-otp`, data);
      localStorage.setItem("jwt", response.data.jwt);
      // DO NOT navigate here — component handles it
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed.",
      );
    }
  },
);

export const createSeller = createAsyncThunk(
  "/sellers/createSeller",
  async (seller, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, seller);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Signup failed.",
      );
    }
  },
);

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    resetSellerAuthState: (state) => {
      state.otpSent = false;
      state.jwt = null;
      state.error = null;
      state.loading = false;
    },
    clearSellerAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.error = action.payload;
      })

      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt; // jwt set only on actual login
        state.otpSent = false;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state) => {
        state.loading = false;
        // DO NOT set jwt here — seller needs admin approval first
        // Setting jwt would trigger route guards to auto-redirect to dashboard
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSellerAuthState, clearSellerAuthError } =
  sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
