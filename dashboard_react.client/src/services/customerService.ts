import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerResponse } from "../types/CustomerResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCustomers = async (
  filter?: string,
  page = 1,
  pageSize = 10,
) => {
  let response: ApiResponse<CustomerResponse[]>;

  if (!filter) {
    response = await api.get<object, ApiResponse<CustomerResponse[]>>(
      `/customer?page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<object, ApiResponse<CustomerResponse[]>>(
      `/customer?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createCustomer = async (customer: CustomerRequest) => {
  const response = await api.post<
    CustomerRequest,
    ApiResponse<CustomerResponse | ValidationFailure[]>
  >("/customer", customer);

  return response;
};

export const updateCustomer = async (customer: CustomerRequest) => {
  const response = await api.put<
    CustomerRequest,
    ApiResponse<CustomerResponse | ValidationFailure[]>
  >(`/customer`, customer);

  return response;
};
