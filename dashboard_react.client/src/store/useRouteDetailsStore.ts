import { create } from "zustand";

import { getRouteDetails } from "../services/routeDetailService";
import { RouteDetailsRequest } from "../types/RouteDetailsRequest";
import { RouteDetailsResponse } from "../types/RouteDetailsResponse";
import { ApiError } from "../util/errors";

import { logger } from "./logger";

interface RouteDetailState {
  route: RouteDetailsRequest[];
  savedRoutes: RouteDetailsResponse[];
  loading: boolean;
  add: (detail: RouteDetailsRequest[]) => void;
  getRouteDetailsByRouteId: (
    routeId: string,
    setError: (error: ApiError) => void,
  ) => Promise<RouteDetailsResponse[]>;
}

export const useRouteDetailStore = create<RouteDetailState>(
  logger(
    (set) => ({
      route: [],
      savedRoutes: [],
      loading: false,
      add: (route) => set({ route }),
      getRouteDetailsByRouteId: async (routeId, setError) => {
        try {
          set({ loading: true });
          const details = await getRouteDetails(
            `RouteId:eq:${routeId} AND State:eq:1`,
          );
          set({ savedRoutes: details.data ?? [] });
          set({ loading: false });
          return details.data ?? [];
        } catch (error) {
          setError(error as ApiError);
          set({ savedRoutes: [] });
          set({ loading: false });
          return [];
        }
      },
    }),
    "useRouteDetailStore",
  ),
);
