import { create } from "zustand";
import { OrderResponse } from "../types/OrderResponse";
import { logger } from "./logger";
import { ListFilter } from "../types/LIstFilter";

interface OrderState {
  filters: ListFilter;
  setFilters: (filters: ListFilter) => void;
  order: OrderResponse | null;
  add: (catalogue: OrderResponse | null) => void;
}

export const useOrderStore = create<OrderState>()(
  logger(
    (set) => ({
      filters: { filter: "", page: 1, pageSize: 10 },
      setFilters: (filters) => set({ filters }),
      order: null,
      add: (order) => {
        if (order == null) {
          return set({ order });
        }

        const [month, day, year] = order.deliveryDate.split("/").map(Number);
        const date = new Date(year, month - 1, day, 0, 0, 0);

        const newOrder = {
          ...order,
          deliveryDate: date,
        };

        return set({ order: newOrder });
      },
    }),
    "useOrderStore",
  ),
);
