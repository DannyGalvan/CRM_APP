import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getCustomerAddress = async (filter?: string) => {
  let response: ApiResponse<CustomerAddressResponse[] | ValidationFailure[]>;

  if (!filter) {
    response = await api.get<any, ApiResponse<CustomerAddressResponse[]>, any>(
      "/customerDirection",
    );
  } else {
    response = await api.get<any, ApiResponse<CustomerAddressResponse[]>, any>(
      `/customerDirection?filters=${filter}`,
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

export const updateCustomerAddress = async (customer: CustomerAddressRequest) => {
  const response = await api.put<
    CustomerAddressRequest,
    ApiResponse<CustomerAddressResponse | ValidationFailure[]>,
    any
  >(`/customerDirection`, customer);

  return response;
};
