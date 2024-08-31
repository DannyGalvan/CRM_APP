import { OrderRequest } from "./OrderRequest";

export interface RouteDetailsResponse {
  id: string;
  routeId: string;
  orderId: string;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  route: RouteRequest;
  order: OrderRequest;
}
