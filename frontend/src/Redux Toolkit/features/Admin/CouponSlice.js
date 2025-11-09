import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL = "/api/coupons";
export const createCoupon = createAsyncThunk(
  "/coupon/createCoupon",
  async ({ jwt, coupon }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/create`, coupon, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Create coupon", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const fetchAllCoupon = createAsyncThunk(
  "/coupon/fetchAllCoupon",
  async ( jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/all`,  {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Fetch All coupon", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  },
);

export const deleteCoupon=createAsyncThunk(
    "/coupon/deleteCoupon",
    async ({jwt, id}, {rejectWithValue})=>{
        try {
            const response = await api.delete(`${API_URL}/admin/delete/${id}`,{
                headers: {
                    Authorization: `Bearer ${jwt}`,

                },
            });
            console.log("delete coupon", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error);
        }
    }
)

const initialState={
    coupons:[],
    loading:false,
    error:""
}

const couponSlice=createSlice({
    name:"coupon",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder .addCase(createCoupon.pending, (state)=>{
            state.loading=true;
            state.error="";
        })
        .addCase(createCoupon.fulfilled, (state, action)=>{
            state.loading=false;
            state.coupons.push(action.payload);
        })
        .addCase(createCoupon.rejected, (state, action)=>{
            state.loading = false;
            state.error=action.error.message;
        })
        .addCase(fetchAllCoupon.pending, (state)=>{
            state.loading=true;
            state.error = "";
        })
        .addCase(fetchAllCoupon.fulfilled, (state, action)=>{
            state.loading=false;
            state.coupons=action.payload;
        })
        .addCase(fetchAllCoupon.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
        .addCase(deleteCoupon.pending, (state)=>{
            state.loading=true;
            state.error="";
        })
        .addCase(deleteCoupon.fulfilled, (state, action)=>{
            state.loading = false;
            state.coupons = state.coupons.filter(
                (coupon)=>coupon._id !== action.meta.arg
            );
        })
    },
});

export default couponSlice.reducer;

