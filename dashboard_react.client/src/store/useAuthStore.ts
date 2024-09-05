import { InitialAuth } from "../types/InitialAuth";
import { authInitialState } from "../config/contants";
import { setAuthorization } from "../config/axios/interceptors";
import { create } from "zustand";
import { logger } from "./logger";

interface AuthState {
  authState: InitialAuth;
  loading: boolean;
  syncAuth: () => void;
  signIn: (login: InitialAuth) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  logger((set, get) => ({
    authState: authInitialState,
    loading: false,
    syncAuth: () => {
      const storedState = window.localStorage.getItem("@auth");
      if (storedState) {
        const initialState: InitialAuth = JSON.parse(storedState);
        setAuthorization(initialState.token);
        set({ authState: initialState });
      }
    },
    signIn: (auth) => {
      const newState = {
        ...get().authState,
        ...auth,
      };
      set({ authState: newState });
      setAuthorization(auth.token);
      window.localStorage.setItem("@auth", JSON.stringify(newState));
      return newState;
    },
    logout: () => {
      window.localStorage.clear();
      setAuthorization("");
      set({ authState: authInitialState });
      return authInitialState;
    },
  })),
);
