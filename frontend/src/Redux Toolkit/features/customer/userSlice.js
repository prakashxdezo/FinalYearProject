import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const API_URL="/api/users"
export const fetchUserProfile = createAsyncThunk(
  "/users/fetchUserProfile",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
      });
      console.log("fetch user profile", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

const initialState={
    user:null,
    loading:false,
    error: " ",
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        resetUserState:(state)=>{
            state.user=null
            state.loading=false
            state.error=""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
    }
})
export const {resetUserState}=userSlice.actions

export default userSlice.reducer