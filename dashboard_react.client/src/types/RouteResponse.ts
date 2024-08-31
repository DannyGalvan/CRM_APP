import { PilotResponse } from "./PilotResponse";

export interface RouteResponse {
  id: string;
  pilotId: string;
  observations: string;
  state: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  pilot: PilotResponse;
}
