import { createSlice } from "@reduxjs/toolkit";
import { Order } from "../models/order";
import { orderApi } from "../api/apiAndInterceptor";

type State = {
  orders: { pager: any; orderList: Order[] } | any;
  loading: boolean;
};

const initialState: State = {
  orders: undefined,
  loading: true,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    getOrders: (state, action) => {  
      state.orders = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getOrders, setLoading } = ordersSlice.actions;

export const getOrdersForCurrentUserAsync =
  (pageIndex?: number, callback?: any) => (dispatch: any) => {
    dispatch(setLoading());
    orderApi()
      .getAllForCurrentUser(pageIndex!)
      .then((result) => {   
        dispatch(getOrders(result));
        if (callback) {
          callback();
        }
      });
  };

export default ordersSlice.reducer;
