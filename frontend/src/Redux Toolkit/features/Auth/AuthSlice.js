import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { resetUserState } from "../customer/userSlice";
import { resetSellerAuthState } from "../seller/sellerAuthentication";

const API_URL = "/auth";

const initialState = {
  jwt: null,
  role: null,
  loading: false,
  error: null,
  otpSent: false,
};

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/send/login-signup-otp`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signup`, signupRequest);
      // Save token but DO NOT navigate here — let the component handle it
      localStorage.setItem("jwt", response.data.jwt);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const signin = createAsyncThunk(
  "/auth/signin",
  async (signinRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signin`, signinRequest);
      localStorage.setItem("jwt", response.data.jwt);
      // DO NOT navigate here — let the component handle it
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.role = null;
      state.otpSent = false;
      localStorage.removeItem("jwt");
    },
    resetOtpSent: (state) => {
      state.otpSent = false;
    },
    resetAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // reset after success
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.role = action.payload.role;
        state.otpSent = false; // reset after success
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetOtpSent, resetAuthError } = authSlice.actions;

export const performLogout = () => async (dispatch) => {
  dispatch(logout());
  dispatch(resetUserState());
  dispatch(resetSellerAuthState());
  localStorage.removeItem("jwt");
};

export default authSlice.reducer;
