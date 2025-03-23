import axios from "axios";
import { Product } from "../models/product";
import { Category } from "../models/category";
import { ChangePassword } from "../models/changePassword";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const pageSize = 12;

export const productApi = () => {
  let url = process.env.REACT_APP_API_URL + "product/";

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
    create: (newRecord: FormData) => {
      return axios({
        method: "post",
        url: url + "create",
        data: newRecord,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    update: (updateRecord: FormData) => {
      return axios({
        method: "put",
        url: url + "edit",
        data: updateRecord,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    delete: (id: any) => axios.delete(url + "delete/?id=" + id),
  };
};

export const categoryApi = () => {
  let url = process.env.REACT_APP_API_URL + "category/";

  return {
    getAll: (pageIndex?: number, pageSizePar?: number, searchText?: string) =>
      axios.get(
        url +
          `getall?${pageSizePar ? "pageSize=" + pageSizePar : ""}${
            pageIndex ? "&pageIndex=" + pageIndex : ""
          }&searchText=${searchText ? searchText : ""}`
      ),
    getById: (id: number) => axios.get(url + "details/?id=" + id),
    create: (newRecord: FormData) => {
      return axios({
        method: "post",
        url: url + "create",
        data: newRecord,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    update: (updateRecord: FormData) => {
      return axios({
        method: "put",
        url: url + "edit",
        data: updateRecord,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    delete: (id: number) => axios.delete(url + "delete/?id=" + id),
  };
};

export const authApi = () => {
  let url = process.env.REACT_APP_API_URL + "authenticate/";

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

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    //config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (e) {
    console.log("error", e);
    let errors = "";
    if (e.response?.data?.errors) {

      Object.keys(e.response?.data?.errors).map(function (keyName, keyIndex) {
        if (typeof e.response?.data?.errors[keyName] == "string") {
          errors += e.response?.data?.errors[keyName] + "\n";
        } else {
          errors += e.response?.data?.errors[keyName][0] + "\n";
        }
      });
    }

    if (e.status === 401) {
      errors += "Unauthorized";
    }
    errors = e.message + "\n" + errors;
    showToastError(errors);
    return Promise.reject(e);
  }
);

function showToastError(errorMessage: string) {
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}
