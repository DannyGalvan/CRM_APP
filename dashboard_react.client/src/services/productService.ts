import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { ProductRequest } from "../types/ProductRequest";
import { ProductResponse } from "../types/ProductResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getProducts = async (filter?: string, page = 1, pageSize = 10) => {
  let response: ApiResponse<ProductResponse[]>;

  if (filter) {
    response = await api.get<object, ApiResponse<ProductResponse[]>>(
      `/product?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<object, ApiResponse<ProductResponse[]>>(
      `/product?page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createProduct = async (product: ProductRequest) => {
  const response = await api.post<
    ProductRequest,
    ApiResponse<ProductResponse | ValidationFailure[]>
  >("/product", product);

  return response;
};

export const updateProduct = async (product: ProductRequest) => {
  const response = await api.put<
    ProductRequest,
    ApiResponse<ProductResponse | ValidationFailure[]>
  >(`/product`, product);

  return response;
};
