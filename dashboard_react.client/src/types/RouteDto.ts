import { PilotResponse } from "./PilotResponse";
import { RouteDetailsRequest } from "./RouteDetailsRequest";
import { RouteDetailsResponse } from "./RouteDetailsResponse";

export interface RouteDtoRequest {
  id?: string;
  pilotId: string;
  observations: string;
  state?: number;
  details: RouteDetailsRequest[];
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
  details: RouteDetailsResponse[];
}
