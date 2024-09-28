import { create } from "zustand";
import { RouteDtoResponse } from "../types/RouteDto";
import { ListFilter } from "../types/LIstFilter";

interface RouteState {
  routeFilters: ListFilter;
  setRouteFilters: (routeFilters: ListFilter) => void;
  route: RouteDtoResponse | null;
  add: (route: RouteDtoResponse | null) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  routeFilters: { page: 1, pageSize: 10, filter: "" },
  setRouteFilters: (routeFilters) => set({ routeFilters }),
  route: null,
  add: (route) => set({ route }),
}));
