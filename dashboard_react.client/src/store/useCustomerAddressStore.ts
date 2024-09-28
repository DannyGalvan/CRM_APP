import { create } from "zustand";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";
import { ListFilter } from "../types/LIstFilter";

interface CustomerAddressState {
  addressFilters: ListFilter;
  setAddressFilters: (addressFilters: ListFilter) => void;
  customerAddress: CustomerAddressResponse | null;
  add: (customerAddress: CustomerAddressResponse | null) => void;
}

export const useCustomerAddressStore = create<CustomerAddressState>()(
  (set) => ({
    customerAddress: null,
    addressFilters: {
      filter: "",
      page: 1,
      pageSize: 10,
    },
    setAddressFilters: (addressFilters) => set({ addressFilters }),
    add: (customerAddress) => set({ customerAddress }),
  }),
);
