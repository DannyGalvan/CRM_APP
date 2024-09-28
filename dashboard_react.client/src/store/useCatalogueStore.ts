import { create } from "zustand";

import { logger } from "./logger";

interface CatalogueState {
  catalogue: CatalogueRequest | null;
  add: (catalogue: CatalogueRequest | null) => void;
}

export const useCatalogueStore = create<CatalogueState>()(
  logger(
    (set) => ({
      catalogue: null,
      add: (catalogue) => set({ catalogue }),
    }),
    "useCatalogueStore",
  ),
);
