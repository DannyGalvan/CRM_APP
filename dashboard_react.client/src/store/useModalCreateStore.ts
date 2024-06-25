import { create } from "zustand";
import { ModalType } from "../hooks/useModalStrategies";
import { logger } from "./logger";

interface ModalState {
  isOpen: boolean;
  title: string;
  keyForm: ModalType;
}

interface ModalCreateState {
  modal: {
    isOpen: boolean;
    title: string;
    keyForm: ModalType;
  };
  open: (keyForm: ModalType, title: string) => void;
  close: () => void;
}

const initialModal: ModalState = {
  isOpen: false,
  title: "",
  keyForm: "",
};

export const useModalCreateStore = create<ModalCreateState>()(
  logger(
    (set) => ({
      modal: {
        isOpen: false,
        title: "",
        keyForm: "",
      },
      open: (keyForm, title) =>
        set({
          modal: {
            isOpen: true,
            keyForm,
            title,
          },
        }),
      close: () => set({ modal: initialModal }),
    }),
    "useModalCreateStore",
  ),
);
