import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../models/category";
import { categoryApi } from "../api/apiAndInterceptor";

type State = {
  categories: { pager: any; categoryList: Category[] } | any;
  loading: boolean;
};

const initialState: State = {
  categories: undefined,
  loading: true,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    getCategories: (state, action) => {
      state.categories = action.payload.data;
      state.loading = false;
    },
  },
});

export const { getCategories } = categoriesSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getCategoriesAsync =
  (pageIndex?: number, searchText?: string, callback?: any) =>
  (dispatch: any) => {
    categoryApi()
      .getAll(pageIndex, undefined, searchText)
      .then((result) => {
        if (callback) {
          callback(result?.data?.categoryList);
        }
        dispatch(getCategories(result));
      });
  };
  
export default categoriesSlice.reducer;
