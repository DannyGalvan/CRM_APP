import { RouteDetailsRequest } from "./RouteDetailsRequest";

export interface RouteRequest {
  id?: string;
  pilotId?: string;
  observations?: string;
  state?: number;
  routeDetails?: RouteDetailsRequest[];
}
