import { useQueryClient } from "@tanstack/react-query";
import {
  createCustomerAddress,
  updateCustomerAddress,
} from "../services/customerAddressService";
import { useCustomerAddressStore } from "../store/useCustomerAddressStore";
import { ApiResponse } from "../types/ApiResponse";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";

export const useCustomerAddress = () => {
  const client = useQueryClient();
  const { add } = useCustomerAddressStore();

  const rebootCatalogues = () => {
    updateSearch(QueryKeys.Customers, "");
    updateSearch(QueryKeys.Departments, "");
    updateSearch(QueryKeys.Municipalities, "");
    updateSearch(QueryKeys.Zones, "");
  };

  const create = async (customer: CustomerAddressRequest) => {
    const response = await createCustomerAddress(customer);

    if (response.success) {
      client.invalidateQueries({
        queryKey: [QueryKeys.CustomerDirections],
        type: "all",
        exact: false,
      });
      rebootCatalogues();
    }

    return response;
  };

  const update = async (customer: CustomerAddressRequest) => {
    const response = await updateCustomerAddress(customer);

    await client.invalidateQueries({
      queryKey: [QueryKeys.CustomerDirections],
      type: "all",
      exact: false
    });

    const customers = client.getQueryData<
      ApiResponse<CustomerAddressResponse[]>
    >([QueryKeys.CustomerDirections]);

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
