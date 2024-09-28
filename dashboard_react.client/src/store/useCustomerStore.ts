import { create } from "zustand";

import { CustomerResponse } from "../types/CustomerResponse";
import { ListFilter } from "../types/LIstFilter";

import { logger } from "./logger";

interface CustomerState {
  customerFilters: ListFilter;
  setCustomeFilters: (customerFilters: ListFilter) => void;
  customer: CustomerResponse | null;
  add: (catalogue: CustomerResponse | null) => void;
}

export const useCustomerStore = create<CustomerState>()(
  logger(
    (set) => ({
      customer: null,
      add: (customer) => set({ customer }),
      customerFilters: { filter: "", page: 1, pageSize: 30 },
      setCustomeFilters: (customerFilters) => set({ customerFilters }),
    }),
    "useCustomerStore",
  ),
);
