import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { OrderRequest } from "../types/OrderRequest";
import { OrderResponse } from "../types/OrderResponse";

export const getOrders = async () => {
  const response: ApiResponse<OrderResponse[]> = await api.get<
    any,
    ApiResponse<OrderResponse[]>,
    any
  >("/order");

  return response;
};

export const getOrder = async (id: string) => {
  const response: ApiResponse<OrderResponse> = await api.get<
    any,
    ApiResponse<OrderResponse>,
    any
  >(`/order/${id}`);

  return response;
};

export const createOrder = async (data: OrderRequest) => {
  const response: ApiResponse<OrderResponse> = await api.post<
    any,
    ApiResponse<OrderResponse>,
    OrderRequest
  >("/order", data);

  return response;
};

export const updateOrder = async (data: OrderRequest) => {
  const response: ApiResponse<OrderResponse> = await api.put<
    any,
    ApiResponse<OrderResponse>,
    OrderRequest
  >(`/order`, data);

  return response;
};

export const partialUpdateOrder = async (data: OrderRequest) => {
  const response: ApiResponse<OrderResponse> = await api.patch<
    any,
    ApiResponse<OrderResponse>,
    OrderRequest
  >(`/order`, data);

  return response;
};
