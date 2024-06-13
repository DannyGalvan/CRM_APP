import { useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer } from "../services/customerService";
import { useCustomerStore } from "../store/useCustomerStore";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerResponse } from "../types/CustomerResponse";

export const useCustomer = () => {
  const client = useQueryClient();
  const { add } = useCustomerStore();

  const create = async (customer: CustomerRequest) => {
    const response = await createCustomer(customer);

    client.refetchQueries({
      queryKey: ["customers"],
      type: "active",
      exact: true,
    });

    return response;
  };

  const update = async (customer: CustomerRequest) => {
    const response = await updateCustomer(customer);

    await client.refetchQueries({
      queryKey: ["customers"],
      type: "active",
      exact: true,
    });

    const customers = client.getQueryData<ApiResponse<CustomerResponse[]>>([
      "customers",
    ]);

    if (customers != undefined) {
      const find = customers.data?.find((c) => c.id === customer.id);

      if (find != undefined) {
        find.createdAt = null;
        find.updatedAt = null;
        find.updatedBy = null;
        find.createdBy = null;
      }

      find && add(find);
    }

    return response;
  };

  return { create, update };
};
