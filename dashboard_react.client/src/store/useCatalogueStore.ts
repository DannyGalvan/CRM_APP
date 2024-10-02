import { create } from "zustand";

import { logger } from "./logger";

interface CatalogueState {
  catalogue?: CatalogueRequest | null;
  add: (catalogue: CatalogueRequest | undefined | null) => void;
}

export const useCatalogueStore = create<CatalogueState>()(
  logger(
    (set) => ({
      catalogue: undefined,
      add: (catalogue) => set({ catalogue }),
    }),
    "useCatalogueStore",
  ),
);
