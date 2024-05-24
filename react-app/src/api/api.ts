import axios from "axios";
import { Product } from "../models/product";
import { Category } from "../models/category";
import { ChangePassword } from "../models/changePassword";

const pageSize = 12;

export const productApi = () => {
  let url = process.env.REACT_APP_API_URL + "product/";
  let token = localStorage.getItem("token");
  if (token != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return {
    getAll: (
      categoryId?: number,
      pageIndex?: number,
      pageSizePar?: number,
      searchText?: string
    ) =>
      axios.get(
        url +
          `getall?categoryId=${categoryId ? categoryId : ""}&pageSize=${
            pageSizePar ?? pageSize
          }${pageIndex ? "&pageIndex=" + pageIndex : ""}&searchText=${
            searchText ? searchText : ""
          }`
      ),
    getById: (id: any) => axios.get(url + "details/?id=" + id),
    getByIds: (ids: number[]) => axios.post(url + "getallbyids", ids),
    create: (newRecord: Product) => {
      return axios({
        method: "post",
        url: url + "create",
        data: newRecord,
        headers: { "Content-Type": "application/json" },
      });
    },
    update: (updateRecord: Product) => axios.put(url + "edit", updateRecord),
    delete: (id: any) => axios.delete(url + "delete/?id=" + id),
  };
};

export const categoryApi = () => {
  let url = process.env.REACT_APP_API_URL + "category/";
  let token = localStorage.getItem("token");
  if (token != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return {
    getAll: (pageIndex?: number, pageSizePar?: number, searchText?: string) =>
      axios.get(
        url +
          `getall?${pageSizePar ? "pageSize=" + pageSizePar : ""}${
            pageIndex ? "&pageIndex=" + pageIndex : ""
          }&searchText=${searchText ? searchText : ""}`
      ),
    getById: (id: number) => axios.get(url + "details/?id=" + id),
    create: (newRecord: Category) => axios.post(url + "create", newRecord),
    update: (updateRecord: Category) => axios.put(url + "edit", updateRecord),
    delete: (id: number) => axios.delete(url + "delete/?id=" + id),
  };
};

export const authApi = () => {
  let url = process.env.REACT_APP_API_URL + "authenticate/";
  let token = localStorage.getItem("token");
  if (token != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return {
    login: (email: string, password: string) =>
      axios.post(url + "login", { Username: email, Password: password }),
    register: (email: string, password: string, registerAsAdmin: boolean) =>
      axios.post(url + "register", {
        Email: email,
        Password: password,
        RegisterAsAdmin: registerAsAdmin,
      }),
    changePassword: (changePasswordModel: ChangePassword) =>
      axios({
        method: "post",
        url: url + "changepassword",
        data: changePasswordModel,
        headers: { "Content-Type": "application/json" },
      }),
  };
};

export const orderApi = () => {
  let url = process.env.REACT_APP_API_URL + "order/";
  let token = localStorage.getItem("token");
  if (token != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return {
    getAll: (pageIndex: number, pageSizePar?: number) =>
      axios.get(
        url +
          `getall?pageSize=${pageSizePar ?? pageSize}${
            pageIndex ? "&pageIndex=" + pageIndex : ""
          }`
      ),
    getAllForCurrentUser: (pageIndex: number) =>
      axios.get(
        url +
          `GetallforcurrentUser?pageSize=${8}${
            pageIndex ? "&pageIndex=" + pageIndex : ""
          }`
      ),
    create: (orderItems: any, promoCode: string | null) => {
      return axios({
        method: "post",
        url: url + "createorder?promoCode=" + promoCode,
        data: orderItems,
        headers: { "Content-Type": "application/json" },
      });
    },
    ship: (id: number) => axios.post(url + "shiporder/?id=" + id),
  };
};

export const promoCodeApi = () => {
  let url = process.env.REACT_APP_API_URL + "promocode/";
  let token = localStorage.getItem("token");
  if (token != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  return {
    getAll: (
      pageIndex?: number,
      pageSizePar?: number,
      searchText?: string,
      getOnlyUsed?: boolean
    ) =>
      axios.get(
        url +
          `getall?pageSize=${pageSizePar ?? pageSize}${
            pageIndex ? "&pageIndex=" + pageIndex : ""
          }&searchText=${searchText ? searchText : ""}${
            getOnlyUsed ? "&getOnlyUsed=true" : ""
          }`
      ),
    generate: (quantity: number, discount: number) =>
      axios.post(
        url +
          "generatepromocodes/?quantity=" +
          quantity +
          "&discount=" +
          discount
      ),
    delete: (id: number) => axios.delete(url + "delete/?id=" + id),
    getByPromoCodeText: (promoCodeText: string) =>
      axios.get(url + "getbypromocodetext/?promoCodeText=" + promoCodeText),
  };
};
