import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";


export const createHomeCategories = createAsyncThunk(
  "home/createHomeCategories",
  async (homeCategories, { rejectWithValue }) => {
    try {
      const response = await api.post("/home/categories", homeCategories);
      console.log("home categories", response.data)
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch home categories",
      );
    }
  },
);

export const fetchHomeCategories = createAsyncThunk(
  "home/fetchHomeCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/home/home-category");
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch home categories"
      );
    }
  }
);

export const updateHomeCategory = createAsyncThunk(
  "home/updateHomeCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/home/home-category/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteHomeCategory = createAsyncThunk(
  "home/deleteHomeCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/home/home-category/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);




const initialState = {

  homeCategories: {
    CLOTHES_CATEGORIES: [],
    GRID: [],
    SHOP_BY_CATEGORIES: [],
    DEAL_CATEGORIES: [],
    DEAL: []
  },
  loading: false,
  error: null,
};

const HomeCategorySlice = createSlice({
  name: "homeCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeCategories.fulfilled, (state, action) => {
        state.loading = false;

        // group categories by section
        const grouped = action.payload.reduce(
          (acc, category) => {
            const section = category.section;
            if (!acc[section]) acc[section] = [];
            acc[section].push(category);
            return acc;
          },
          {
            CLOTHES_CATEGORIES: [],
            GRID: [],
            SHOP_BY_CATEGORIES: [],
            DEAL_CATEGORIES: [],
            DEALS: [],
          },
        );

        state.homeCategories = grouped;
      })
      .addCase(createHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        const grouped = action.payload.reduce(
          (acc, category) => {
            const section = category.section;
            if (!acc[section]) acc[section] = [];
            acc[section].push(category);
            return acc;
          },
          {
            CLOTHES_CATEGORIES: [],
            GRID: [],
            SHOP_BY_CATEGORIES: [],
            DEAL_CATEGORIES: [],
            DEALS: [],
          },
        );
        state.homeCategories = grouped;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;
        const section = updated.section;
        if (state.homeCategories[section]) {
          const index = state.homeCategories[section].findIndex(
            (c) => c._id === updated._id,
          );
          if (index !== -1) state.homeCategories[section][index] = updated;
        }
      })
      .addCase(updateHomeCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        // remove from whichever section it's in
        Object.keys(state.homeCategories).forEach((section) => {
          state.homeCategories[section] = state.homeCategories[section].filter(
            (c) => c._id !== action.payload,
          );
        });
      })
      .addCase(deleteHomeCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default HomeCategorySlice.reducer;
