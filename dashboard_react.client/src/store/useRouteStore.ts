import { create } from "zustand";
import { logger } from "./logger";
import { RouteDtoResponse } from "../types/RouteDto";

interface RouteState {
  route: RouteDtoResponse | null;
  add: (route: RouteDtoResponse | null) => void;
}

export const useRouteStore = create<RouteState>()(
  logger(
    (set) => ({
      route: null,
      add: (route) => set({ route }),
    }),
    "useRouteStore",
  ),
);
