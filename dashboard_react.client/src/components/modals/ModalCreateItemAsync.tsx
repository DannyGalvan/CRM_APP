import { lazy } from "react";

export const ModalCreateItemAsync = lazy(() =>
  import("../../components/modals/ModalCreateItem").then((module) => ({
    default: module.ModalCreateItem,
  })),
);
