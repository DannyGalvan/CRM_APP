import { create } from "zustand";
import { OrderResponse } from "../types/OrderResponse";
import { logger } from "./logger";
import { CashReportRequest } from "../types/CashReportRequest";
import { ApiError } from "../util/errors";
import { CashReportDetailsResponse } from "../types/CashReportDetailResponse";
import { getCashReportDetails } from "../services/cashReportDetailService";

interface CashReportState {
  cashReport: CashReportRequest | null;
  orders: OrderResponse[];
  savedOrders: CashReportDetailsResponse[];
  loadingSavedRoutes: boolean;
  addOrders: (orders: OrderResponse[]) => void;
  getDetailsByCashReportId: (
    cashReportId: string,
    setError: (error: ApiError) => void,
  ) => Promise<CashReportDetailsResponse[]>;
  addCashReport: (cashReport: CashReportRequest | null) => void;
  getTotalOrders: () => string;
}

export const useCashReportStore = create<CashReportState>()(
  logger(
    (set, get) => ({
      orders: [],
      savedOrders: [],
      cashReport: null,
      loadingSavedRoutes: false,
      addOrders: (orders) => set({ orders }),
      getDetailsByCashReportId: async (cashReportId, setError) => {
        try {
          set({ loadingSavedRoutes: true });
          const details = await getCashReportDetails(
            `CashReportId:eq:${cashReportId} AND State:eq:1`,
          );
          set({ savedOrders: details.data! });
          set({ loadingSavedRoutes: false });
          return details.data!;
        } catch (error) {
          setError(error as ApiError);
          console.error(error);
          set({ savedOrders: [] });
          set({ loadingSavedRoutes: false });
          return [];
        }
      },
      addCashReport: (cashReport) => set({ cashReport }),
      getTotalOrders: () => {
        if (get().orders.length > 0) {
          return get().orders.reduce((acc, order) => acc + order.total, 0).toFixed(2);
        }
        return "0.00";
      },
    }),
    "useCashReportStore",
  ),
);
