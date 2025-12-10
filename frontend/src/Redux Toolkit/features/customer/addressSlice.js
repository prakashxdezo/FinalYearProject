import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  addresses: [],
  loading: false,
  error: "",
};

const API_URL = "/api/addresses";

// Fetch user addresses
export const fetchUserAddresses = createAsyncThunk(
  "address/fetchUserAddresses",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data; // array of addresses
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Add a new address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ jwt, address }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, address, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data; // newly created address
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;

