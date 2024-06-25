import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { ProductRequest } from "../types/ProductRequest";
import { ProductResponse } from "../types/ProductResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getProducts = async (filter?: string) => {
  let response;

  if (filter) {
    response = await api.get<any,ApiResponse<ProductResponse[]>,any>(
      `/product?filters=${filter}`
    );
  } else {
    response = await api.get<any, ApiResponse<ProductResponse[]>, any>("/product");
  }

  return response;
};

export const createProduct = async (product: ProductRequest) => {
  const response = await api.post<
    CustomerRequest,
    ApiResponse<ProductResponse | ValidationFailure[]>,
    any
  >("/product", product);

  return response;
};

export const updateProduct = async (product: ProductRequest) => {
  const response = await api.put<
    CustomerRequest,
    ApiResponse<ProductResponse | ValidationFailure[]>,
    any
  >(`/product`, product);

  return response;
};