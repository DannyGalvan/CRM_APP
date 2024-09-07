import { useDrawerStore } from "../store/useDrawerStore";

export const useDrawer = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } =
    useDrawerStore();
    
  return { openCreate, openUpdate, setOpenCreate, setOpenUpdate };
};
