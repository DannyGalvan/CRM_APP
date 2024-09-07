import { create } from "zustand";
import { RouteDetailsRequest } from "../types/RouteDetailsRequest";
import { getRouteDetails } from "../services/routeDetailService";
import { ApiError } from "../util/errors";
import { RouteDetailsResponse } from "../types/RouteDetailsResponse";

interface RouteDetailState {
  route: RouteDetailsRequest[];
  savedRoutes: RouteDetailsRequest[];
  loading: boolean;
  add: (detail: RouteDetailsRequest[]) => void;
  getRouteDetailsByRouteId: (
    routeId: string,
    setError: (error: ApiError) => void,
  ) => Promise<RouteDetailsResponse[]>;
}

export const useRouteDetailStore = create<RouteDetailState>()((set) => ({
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
      set({ savedRoutes: details.data! });
      set({ loading: false });
      return details.data!;
    } catch (error) {
      setError(error as ApiError);
      console.error(error);
      set({ savedRoutes: [] });
      set({ loading: false });
      return [];
    }
  },
}));
