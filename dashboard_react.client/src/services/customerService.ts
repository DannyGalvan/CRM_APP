import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerResponse } from "../types/CustomerResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCustomers = async () => {
  const response = await api.get<any, ApiResponse<CustomerResponse[]>,any>("/customer");

  return response;
};

export const createCustomer = async (customer: CustomerRequest) => {
  const response = await api.post<
    CustomerRequest,
    ApiResponse<CustomerResponse | ValidationFailure[]>,
    any
  >("/customer", customer);

  return response;
};

export const updateCustomer = async (customer: CustomerRequest) => {
  const response = await api.put<
    CustomerRequest,
    ApiResponse<CustomerResponse | ValidationFailure[]>,
    any
  >(`/customer`, customer);

  return response;
};
