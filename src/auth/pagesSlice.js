// src/redux/slices/pagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchPages = createAsyncThunk(
  "pages/fetchPages",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/get-pages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.pages;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const pagesSlice = createSlice({
  name: "pages",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pagesSlice.reducer;
