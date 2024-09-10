import { useQueryClient } from "@tanstack/react-query";
import {
  createCustomerAddress,
  updateCustomerAddress,
} from "../services/customerAddressService";
import { useCustomerAddressStore } from "../store/useCustomerAddressStore";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";

export const useCustomerAddress = () => {
  const client = useQueryClient();
  const { add } = useCustomerAddressStore();

  const create = async (customer: CustomerAddressRequest) => {
    const response = await createCustomerAddress(customer);
    client.invalidateQueries({
      queryKey: ["customerAddress"],
      type: "active",
      exact: true,
    });
    return response;
  };

  const update = async (customer: CustomerAddressRequest) => {
    const response = await updateCustomerAddress(customer);

    await client.invalidateQueries({
      queryKey: ["customersAddress"],
      type: "active",
      exact: true,
    });

    const customers = client.getQueryData<
      ApiResponse<CustomerAddressResponse[]>
    >(["customerAddress"]);

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

  return {
    create,
    update,
  };
};
