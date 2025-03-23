import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../models/product";
import { productApi } from "../api/apiAndInterceptor";

type State = {
  products: { pager: any; productList: Product[] } | any;
  product: Product | any;
  loading: boolean;
};

const initialState: State = {
  products: undefined,
  product: undefined,
  loading: true,
};

export const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    getProducts: (state, action) => {
      state.products = action.payload.data;
      state.loading = false;
    },
    getProduct: (state, action) => {
      state.product = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getProducts, getProduct, setLoading } = productsSlice.actions;

export const getProductsAsync =
  (
    categoryId?: number,
    pageIndex?: number,
    searchText?: string,
    callback?: any
  ) =>
  (dispatch: any) => {
    dispatch(setLoading());
    productApi()
      .getAll(categoryId, pageIndex, undefined, searchText)
      .then((result) => {
        dispatch(getProducts(result));
      });
  };

export const getProductAsync =
  (id: number, callback?: any) => (dispatch: any) => {
    dispatch(setLoading());
    productApi()
      .getById(id)
      .then((result) => {
        dispatch(getProduct(result));
        if (callback) {
          callback();
        }
      });
  };

export default productsSlice.reducer;
