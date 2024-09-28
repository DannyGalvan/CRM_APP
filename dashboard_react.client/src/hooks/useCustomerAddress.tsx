import { useQueryClient } from "@tanstack/react-query";
import {
  createCustomerAddress,
  updateCustomerAddress,
} from "../services/customerAddressService";
import { useCustomerAddressStore } from "../store/useCustomerAddressStore";
import { updateSearch } from "../obsevables/searchObservable";
import { QueryKeys } from "../config/contants";

export const useCustomerAddress = () => {
  const client = useQueryClient();
  const { addressFilters } = useCustomerAddressStore();

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

    client.refetchQueries({
      queryKey: [
        QueryKeys.CustomerDirections,
        addressFilters.filter,
        "",
        "",
        addressFilters.page,
        addressFilters.pageSize,
      ],
      type: "all",
      exact: true,
    });

    return response;
  };

  return {
    create,
    update,
  };
};
