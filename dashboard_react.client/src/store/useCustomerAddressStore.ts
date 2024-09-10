import { create } from "zustand";
import { CustomerAddressResponse } from "../types/CustomerAddressResponse";
import { logger } from "./logger";

interface CustomerAddressState {
  customerAddress: CustomerAddressResponse | null;
  add: (customerAddress: CustomerAddressResponse | null) => void;
}

export const useCustomerAddressStore = create<CustomerAddressState>()(
  logger(
    (set) => ({
      customerAddress: null,
      add: (customerAddress) => set({ customerAddress }),
    }),
    "useCustomerAddressStore",
  ),
);
