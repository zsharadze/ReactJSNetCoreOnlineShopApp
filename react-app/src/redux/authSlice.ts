import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/apiAndInterceptor";

type User = {
  userEmail: string;
  userRole: string;
};

type State = {
  isAuthenticated: boolean;
  user: User | null;
};

const initialState: State = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("tokenExpiration", action.payload.tokenExpiration);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", action.payload.userRole);
      localStorage.setItem("userEmail", action.payload.userEmail);

      state.isAuthenticated = true;
      state.user = {
        userEmail: action.payload.userEmail,
        userRole: action.payload.userRole,
      };
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");

      state.isAuthenticated = false;
      state.user = null;
    },
    setIsAuthenticated: (state) => {
      let userEmail = localStorage.getItem("userEmail");
      let userRole = localStorage.getItem("userRole");

      state.isAuthenticated = true;
      state.user = {
        userEmail: userEmail ?? "",
        userRole: userRole ?? "",
      };
    },
  },
});

export const { login, logout, setIsAuthenticated } = authSlice.actions;

export const loginAsync =
  (email: string, password: string, callback?: any) => (dispatch: any) => {
    authApi()
      .login(email, password)
      .then((res) => {
        if (res.data.success) {
          dispatch(
            login({
              userEmail: email,
              userRole: res.data.userRole,
              token: res.data.token,
              tokenExpiration: res.data.tokenExpiration,
            })
          );
        }
        if (callback) {
          callback(res.data, res.data.userRole);
        }
      })
      .catch((error) => {});
  };

export const logoutAsync = (callback?: any) => (dispatch: any) => {
  dispatch(logout());

  if (callback) {
    callback();
  }
};

export default authSlice.reducer;
