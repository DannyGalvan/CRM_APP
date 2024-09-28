import { create } from "zustand";

import { PilotResponse } from "../types/PilotResponse";
import { ListFilter } from "../types/LIstFilter";

interface PilotState {
  filterPilot: ListFilter;
  setFilterPilot: (filterPilot: ListFilter) => void;
  pilot: PilotResponse | null;
  add: (catalogue: PilotResponse | null) => void;
}

export const usePilotStore = create<PilotState>((set) => ({
  filterPilot: {
    filter: "",
    page: 1,
    pageSize: 10,
  },
  setFilterPilot: (filterPilot) => set({ filterPilot }),
  pilot: null,
  add: (pilot) => set({ pilot }),
}));
