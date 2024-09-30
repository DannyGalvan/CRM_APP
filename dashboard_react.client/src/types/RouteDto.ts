import { PilotResponse } from "./PilotResponse";
import { RouteDetailsRequest } from "./RouteDetailsRequest";

export interface RouteDtoRequest {
  id?: string;
  pilotId: string;
  observations: string;
  state?: number;
  routeDetails: RouteDetailsRequest[];
}

export interface RouteDtoResponse {
  id: string;
  pilotId: string;
  observations: string;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  pilot: PilotResponse;
  routeDetails: RouteDetailsRequest[];
}
