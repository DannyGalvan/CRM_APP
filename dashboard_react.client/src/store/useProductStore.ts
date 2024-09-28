import { create } from "zustand";

import { ProductResponse } from "../types/ProductResponse";
import { ListFilter } from "../types/LIstFilter";

import { logger } from "./logger";

interface ProductState {
  productFilters: ListFilter;
  setProductFilters: (productFilters: ListFilter) => void;
  product: ProductResponse | null;
  add: (catalogue: ProductResponse | null) => void;
}

export const useProductStore = create<ProductState>()(
  logger(
    (set) => ({
      product: null,
      productFilters: { filter: "", page: 1, pageSize: 10 },
      setProductFilters: (productFilters) => set({ productFilters }),
      add: (product) => set({ product }),
    }),
    "useProductStore",
  ),
);
