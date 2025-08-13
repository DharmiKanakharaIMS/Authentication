// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        userData
      );
      const result = res.data;

      if (result.successCode === 200) {
        alert(result.message)
        const expiresAt = new Date().getTime() +  60 * 60 * 1000; // 1 hour
        return {
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          expiresAt,
        };
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
 
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (accessuserToken, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessuserToken}`
        }
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    error: null,
  },
  reducers: {
    loadAuthFromStorage(state) {
      const data = JSON.parse(localStorage.getItem("auth"));
      if (data && data.accessToken && new Date().getTime() < data.expiresAt) {
        state.user = data.user;
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
        state.expiresAt = data.expiresAt;
        state.isAuthenticated = true;
      }
    },
    setUsers: (state,action)=>
    {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.error = null;

        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
         state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload || "Login failed";
      }) .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      }).addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Registered successfully";
      }).addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.error = null;
        localStorage.removeItem("auth");
      });
      
  },
});

export const { loadAuthFromStorage ,setUsers} = authSlice.actions;
export default authSlice.reducer;
