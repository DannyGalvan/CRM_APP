import { CashReportResponse } from "./CashReportResponse";
import { OrderResponse } from "./OrderResponse";

export interface CashReportDetailsResponse {
  id: string;
  cashReportId: string;
  orderId: string;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  cashReport: CashReportResponse;
  order: OrderResponse;
}