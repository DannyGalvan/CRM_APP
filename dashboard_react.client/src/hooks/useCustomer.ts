import { useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer } from "../services/customerService";
import { useCustomerStore } from "../store/useCustomerStore";
import { QueryKeys } from "../config/contants";

export const useCustomer = () => {
  const client = useQueryClient();
  const { customerFilters } = useCustomerStore();

  const create = async (customer: CustomerRequest) => {
    const response = await createCustomer(customer);

    if (response.success) {
      client.refetchQueries({
        queryKey: [
          QueryKeys.Customers
        ],
        type: "all",
        exact: false,
      });
    }

    return response;
  };

  const update = async (customer: CustomerRequest) => {
    const response = await updateCustomer(customer);

    client.refetchQueries({
      queryKey: [
        QueryKeys.Customers,
        customerFilters.filter,
        "",
        "",
        customerFilters.page,
        customerFilters.pageSize,
      ],
      type: "all",
      exact: true,
    });

    return response;
  };

  return { create, update };
};
