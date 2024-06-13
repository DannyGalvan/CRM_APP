import { create } from "zustand";
import { ApiError } from "../util/errors";
import { logger } from "./logger";

interface ErrorState {
  error: ApiError | null;
  add: (error: ApiError) => void;
}

export const useErrorStore = create<ErrorState>()(
  logger(
    (set) => ({
      error: null,
      add: (error: ApiError) => set({ error }),
    }),
    "useCatalogueStore",
  ),
);
