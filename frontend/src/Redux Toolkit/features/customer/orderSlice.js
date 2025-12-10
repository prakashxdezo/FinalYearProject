import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  orders: [],
  loading: false,
  error: "",
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
};

const API_URL = "/api/orders";

export const fetchUserOrderHistory = createAsyncThunk(
  "/orders/fetchUserOrderHistory",
  async (jwt, { rejectWithValue }) => {
    // use `jwt` here
    try {
      const response = await api.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch user order history", response.data);
      return response.data;
    } catch (error) {
      // return just the message (serializable) instead of the error object
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);


export const fetchOrderById = createAsyncThunk(
  "/orders/fetchOrderById",

  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch order by id", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const createOrder = createAsyncThunk(
  "/orders/createOrder",

  async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}`,
        {
          shippingAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: { paymentMethod: paymentGateway },
        },
      );
      console.log("create order", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const fetchOrderItemById = createAsyncThunk(
  "/orders/fetchOrderItemById",

  async ({ jwt, orderItemId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/item/${orderItemId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch order item by id", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);



export const paymentSuccess = createAsyncThunk(
  "/orders/paymentSuccess",

  async ({ jwt, paymentId, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: { paymentLinkId },
      });
      console.log("payment success", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "/orders/cancelOrder",
  async ({ orderId, jwt }, { rejectWithValue }) => {

    try {
      const response = await api.put(
        `${API_URL}/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      console.log("Cancel order by id", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);




const orderSlice=createSlice({
    name:"orders",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
          .addCase(fetchUserOrderHistory.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
          })
          .addCase(fetchUserOrderHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(fetchOrderById.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchOrderById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
          })
          .addCase(fetchOrderById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(createOrder.pending, (state) => {
            state.loading = true;
          })
          .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
            state.paymentOrder = action.payload;
          })
          .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(paymentSuccess.pending, (state) => {
            state.loading = true;
          })
          .addCase(paymentSuccess.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
          })
          .addCase(paymentSuccess.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(cancelOrder.pending, (state) => {
            state.loading = true;
          })
          .addCase(cancelOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
          })
          .addCase(cancelOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(fetchOrderItemById.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchOrderItemById.fulfilled, (state, action) => {
            state.loading = false
            state.orderItem=action.payload
          })
          .addCase(fetchOrderItemById.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
          })
    }
})

export default orderSlice.reducer;
