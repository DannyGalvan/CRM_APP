import { create } from "zustand";
import { OrderResponse } from "../types/OrderResponse";
import { logger } from "./logger";
import { CashReportRequest } from "../types/CashReportRequest";

interface CashReportState {
  cashReport: CashReportRequest | null;
  orders: OrderResponse[];
  savedOrders: OrderResponse[];
  loadingSavedRoutes: boolean;
  addOrders: (orders: OrderResponse[]) => void;
  addCashReport: (cashReport: CashReportRequest) => void;
}

export const useCashReportStore = create<CashReportState>()(
  logger(
    (set) => ({
      orders: [],
      savedOrders: [],
      cashReport: null,
      loadingSavedRoutes: false,
      addOrders: (orders) => set({ orders }),
      addCashReport: (cashReport) => set({ cashReport }),
    }),
    "useCashReportStore",
  ),
);
