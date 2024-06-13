import { createContext } from "react";

interface DrawerContextProps {
  setOpenUpdate: () => void;
}

const DrawerContextProps: DrawerContextProps = {
  setOpenUpdate: () => {},
};

export const DrawerContext = createContext<DrawerContextProps>(
  DrawerContextProps,
);

interface DrawerProviderProps {
  children: React.ReactNode;
  setOpenUpdate: () => void;
}

export const DrawerProvider = ({
  children,
  setOpenUpdate,
}: DrawerProviderProps) => {
  return (
    <DrawerContext.Provider value={{ setOpenUpdate }}>
      {children}
    </DrawerContext.Provider>
  );
};
