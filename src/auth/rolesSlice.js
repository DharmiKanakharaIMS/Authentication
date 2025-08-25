// src/features/auth/rolesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Thunks
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/get-roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.roles;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addRole = createAsyncThunk(
  "roles/addRole",
  async ({ newRole, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseUrl}/roles`, newRole, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.role;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ updatedRole, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${baseUrl}/roles/${updatedRole._id}`, updatedRole, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.role;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Role
      .addCase(addRole.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update Role
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // Delete Role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
      });
  },
});

export default rolesSlice.reducer;
