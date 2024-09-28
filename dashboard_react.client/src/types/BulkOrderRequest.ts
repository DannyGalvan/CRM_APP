import { OrderRequest } from "./OrderRequest";

export interface BulkOrderRequest {
  orders: OrderRequest[];
  createdBy: string;
}
