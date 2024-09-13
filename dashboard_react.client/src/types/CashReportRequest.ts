import { OrderResponse } from "./OrderResponse";

export interface CashReportRequest {
  id?: string;
  cashierName?: string;
  observations?: string;
  orderQuantity?: number;
  total?: number;
  state?: number;
  orders: OrderResponse[];
}
