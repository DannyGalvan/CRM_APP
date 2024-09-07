import { OrderResponse } from "./OrderResponse";
import { RouteResponse } from "./RouteResponse";

export interface RouteDetailsResponse {
  id: string;
  routeId: string;
  orderId: string;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  route: RouteResponse;
  order: OrderResponse;
}
