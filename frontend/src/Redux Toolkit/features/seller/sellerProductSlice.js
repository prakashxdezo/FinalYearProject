import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/api/sellers/products";

// --- Async thunks ---
export const fetchSellerProduct = createAsyncThunk(
  "sellerProduct/fetchSellerProduct",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller product", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "sellerProduct/createProduct",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("create product", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "sellerProduct/updateProduct",
  async ({ jwt, product, productId }, { rejectWithValue }) => {
    try {
      // FIX: use PATCH instead of PUT to match backend route
      const response = await api.patch(`${API_URL}/${productId}`, product, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("update product", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "sellerProduct/deleteProduct",
  async ({ jwt, productId }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("deleted product", productId);
      return productId;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// --- Slice ---
const initialState = {
  products: [],
  loading: false,
  error: "",
  updateSuccess: false,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    clearUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSellerProduct
      .addCase(fetchSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.updateSuccess = false;
      })
      .addCase(fetchSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = "";
      })
      .addCase(fetchSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.updateSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = "";
        state.updateSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id,
        );
        if (index !== -1) state.products[index] = action.payload;
        state.error = "";
        state.updateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUpdateSuccess } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
