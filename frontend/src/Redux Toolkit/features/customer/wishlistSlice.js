import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  wishlist: null,
  loading: false,
  error: "",
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (jwt, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/wishlist/add",
        { productId },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; };
    const setData = (state, action) => { state.loading = false; state.wishlist = action.payload; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchWishlist.pending, setLoading)
      .addCase(fetchWishlist.fulfilled, setData)
      .addCase(fetchWishlist.rejected, setError)
      .addCase(addToWishlist.pending, setLoading)
      .addCase(addToWishlist.fulfilled, setData)
      .addCase(addToWishlist.rejected, setError)
      .addCase(removeFromWishlist.pending, setLoading)
      .addCase(removeFromWishlist.fulfilled, setData)
      .addCase(removeFromWishlist.rejected, setError);
  },
});

export default wishlistSlice.reducer;
