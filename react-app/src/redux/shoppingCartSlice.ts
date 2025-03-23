import { createSlice } from "@reduxjs/toolkit";
import { productApi } from "../api/apiAndInterceptor";

type ShoppingCartItem = {
  productId: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageName: string;
};

type State = {
  //   user: undefined | User;
  shoppingCart: ShoppingCartItem[];
  loading: boolean;
};

const initialState: State = {
  shoppingCart: [],
  loading: false,
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState: initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addOrUpdateCart: (state, action) => {
      if (state.shoppingCart.length === 0)
        state.shoppingCart.push(action.payload);
      else {
        var foundIndex = state.shoppingCart.findIndex(
          (x) => x.productId === action.payload.productId
        );
        if (foundIndex > -1) {
          state.shoppingCart[foundIndex].quantity = action.payload.quantity;
        } else {
          state.shoppingCart.push(action.payload);
        }
      }
      state.loading = false;
    },
    addOrUpdateCartPassingArray: (state, action) => {
      if (action.payload.length > 0) {
        for (let k = 0; k < action.payload.length; k++) {
          let foundIndex = state.shoppingCart.findIndex(
            (x) => x.productId === action.payload[k].productId
          );
          if (foundIndex > -1) {
            state.shoppingCart[foundIndex].name = action.payload[k].name;
            state.shoppingCart[foundIndex].description =
              action.payload[k].description;
            state.shoppingCart[foundIndex].unitPrice = action.payload[k].price;
            state.shoppingCart[foundIndex].totalPrice =
              state.shoppingCart[foundIndex].quantity * action.payload[k].price;
            state.shoppingCart[foundIndex].imageName =
              action.payload[k].imageName;
          }
        }
      }
      state.loading = false;
    },
    changeQuantityInCart: (state, action) => {
      var foundIndex = state.shoppingCart.findIndex(
        (x) => x.productId === action.payload.productId
      );
      if (foundIndex > -1) {
        state.shoppingCart[foundIndex].quantity = action.payload.quantity;
        state.shoppingCart[foundIndex].totalPrice =
          state.shoppingCart[foundIndex].unitPrice * action.payload.quantity;
      } else {
        throw new Error(
          `action.payload.productId with ${action.payload.productId} not found it state.shoppingCart`
        );
      }
      state.loading = false;
    },
    removeFromCart: (state, action) => {
      var foundIndex = state.shoppingCart.findIndex(
        (x) => x.productId === action.payload.productId
      );
      state.shoppingCart.splice(foundIndex, 1);
    },
    clearCart: (state) => {
      state.shoppingCart = [];
      state.loading = false;
    },
  },
});

export const getProductsAndAddToStateAsync =
  (productIds: number[]) => (dispatch: any) => {
    dispatch(setLoading());
    productApi()
      .getByIds(productIds)
      .then((result) => {
        if (result && result.data && result.data.length > 0) {
          let productArrayToAdd = [];
          for (let index = 0; index < result.data.length; index++) {
            let productObj: any = {};
            productObj.productId = result.data[index].id;
            productObj.name = result.data[index].name;
            productObj.description = result.data[index].description;
            productObj.price = result.data[index].price;
            productObj.imageName = result.data[index].imageName;
            productArrayToAdd.push(productObj);
          }
          dispatch(addOrUpdateCartPassingArray(productArrayToAdd));
        }
      });
  };

export const {
  addOrUpdateCart,
  changeQuantityInCart,
  removeFromCart,
  setLoading,
  addOrUpdateCartPassingArray,
  clearCart
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
