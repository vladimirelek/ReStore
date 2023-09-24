import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../Router/router";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/store";
axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
const responseBody = (response: AxiosResponse) => response.data;
axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axios.interceptors.response.use(
  (response) => {
    sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);

        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);
const request = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};
const TestErrors = {
  get400Error: () => request.get("buggy/bad-request"),
  get401Error: () => request.get("buggy/unauthorised"),
  get404Error: () => request.get("buggy/not-found"),
  get500Error: () => request.get("buggy/server-error"),
  getValidationError: () => request.get("buggy/validation-error"),
};
const Basket = {
  getBasket: () => request.get("Basket"),
  addItem: (productId: number, quantity = 1) =>
    request.post(`Basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    request.delete(`Basket?productId=${productId}&quantity=${quantity}`),
};
const Catalog = {
  list: (params: URLSearchParams) => request.get("Product", params),
  details: (id: number) => request.get(`Product/${id}`),
  fetchFilters: () => request.get("Product/filter"),
};
const Account = {
  login: (values: any) => request.post("Account/login", values),
  register: (values: any) => request.post("Account/register", values),
  currentAccount: () => request.get("Account/currentUser"),
  fetchAddress: () => request.get("account/savedAdress"),
};
const Orders = {
  list: () => request.get("orders"),
  fetch: (id: number) => request.get(`orders/${id}`),
  create: (values: any) => request.post("Orders", values),
  fetchAdress: () => request.get("account/savedAdress"),
};
const Payments = {
  createPaymentIntent: () => request.post("payments", {}),
};
const agent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payments,
};
export default agent;
