import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { BulkOrderRequest } from "../types/BulkOrderRequest";
import { OrderRequest } from "../types/OrderRequest";
import { OrderResponse } from "../types/OrderResponse";
import { ValidationFailure } from "../types/ValidationFailure";

interface OrderFilters {
  start: string;
  end: string;
}

export const getOrders = async ({ start, end }: OrderFilters) => {
  if (start && end) {
    const response: ApiResponse<OrderResponse[]> = await api.get<
      any,
      ApiResponse<OrderResponse[]>,
      any
    >(`/order?filters=OrderDate:gt:${end}T00 AND OrderDate:lt:${start}T23`);
    return response;
  } else {
    const response: ApiResponse<OrderResponse[]> = await api.get<
      any,
      ApiResponse<OrderResponse[]>,
      any
    >(`/order`);
    return response;
  }
};

export const getFilteredOrders = async (filters: string) => {
  const response: ApiResponse<OrderResponse[]> = await api.get<
    any,
    ApiResponse<OrderResponse[]>,
    any
  >(`/order?filters=${filters}`);

  return response;
}

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
  const response: ApiResponse<OrderResponse | ValidationFailure[]> = await api.patch<
    any,
    ApiResponse<OrderResponse>,
    OrderRequest
  >(`/order`, data);

  return response;
};

export const bulkPartialUpdateOrder = async (data: BulkOrderRequest) => {
  const response: ApiResponse<OrderResponse[] | ValidationFailure[]> = await api.patch<
    any,
    ApiResponse<OrderResponse[]>,
    BulkOrderRequest
  >(`/order/bulk`, data);

  return response;
};
