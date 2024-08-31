import { create } from "zustand";
import { logger } from "./logger";
import { RouteDetailsRequest } from "../types/RouteDetailsRequest";

interface RouteDetailState {
  route: RouteDetailsRequest[];
  add: (detail: RouteDetailsRequest[]) => void;
}

export const useRouteDetailStore = create<RouteDetailState>()(
  logger(
    (set) => ({
      route: [],
      add: (route) => set({ route }),
    }),
    "useRouteDetailStore",
  ),
);
