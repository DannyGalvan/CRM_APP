import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCustomerAddress = async (
  filter?: string,
  page = 1,
  pageSize = 10,
) => {
  let response: ApiResponse<CustomerAddressResponse[]>;

  if (!filter) {
    response = await api.get<object, ApiResponse<CustomerAddressResponse[]>>(
      `/customerDirection?page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<object, ApiResponse<CustomerAddressResponse[]>>(
      `/customerDirection?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createCustomerAddress = async (
  customer: CustomerAddressRequest,
) => {
  const response = await api.post<
    CustomerAddressRequest,
    ApiResponse<CustomerAddressResponse | ValidationFailure[]>,
    any
  >("/customerDirection", customer);

  return response;
};

export const updateCustomerAddress = async (
  customer: CustomerAddressRequest,
) => {
  const response = await api.put<
    CustomerAddressRequest,
    ApiResponse<CustomerAddressResponse | ValidationFailure[]>,
    any
  >(`/customerDirection`, customer);

  return response;
};
