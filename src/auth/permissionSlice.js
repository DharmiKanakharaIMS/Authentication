  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import axios from "axios";

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  export const fetchPermissions = createAsyncThunk(
    "permissions/fetchPermissions",
    async ({ roleId, token }, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${BASE_URL}/get-permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data.permissions;
        return data.filter((item) => item.roleId._id === roleId);
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const addPagePermission = createAsyncThunk(
    "permissions/addPagePermission",
    async ({ roleId, page, token }, { rejectWithValue }) => {
      try {
        const res = await axios.post(
          `${BASE_URL}/permissions`,
          {
            roleId,
            pageId: page._id,
            permissions: [],
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return { ...res.data.data.permission, pageId: page };
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const deletePermission = createAsyncThunk(
    "permissions/deletePermission",
    async ({ permId, token }, { rejectWithValue }) => {
      try {
        await axios.delete(`${BASE_URL}/permissions/${permId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return permId;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );


  export const updatePermission = createAsyncThunk(
    "permissions/updatePermission",
    async ({ permId, permissions, token }, { rejectWithValue }) => {
      try {
        const res = await axios.put(
          `${BASE_URL}/permissions/${permId}`,
          { permissions },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data.permission;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );


  const permissionSlice = createSlice({
    name: "permissions",
    initialState: {
      items: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch
        .addCase(fetchPermissions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchPermissions.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;        
        })
        .addCase(fetchPermissions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Add
        .addCase(addPagePermission.fulfilled, (state, action) => {
          state.items.push(action.payload);
          
        })

        // Delete
        .addCase(deletePermission.fulfilled, (state, action) => {
          state.items = state.items.filter((p) => p._id !== action.payload);
        })

        // Update
        .addCase(updatePermission.fulfilled, (state, action) => {
          const updated = action.payload;
          
          const index = state.items.findIndex(p => p._id === updated._id);

          if (index !== -1) {
              state.items[index] = {
              ...state.items[index], // keep old pageId, roleId, etc.
              ...updated,
              pageId: state.items[index].pageId, // ✅ force keep existing populated page object
              };
              }
        });
    },
  });

  export default permissionSlice.reducer;