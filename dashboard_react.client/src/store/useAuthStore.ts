import { create } from "zustand";

import { InitialAuth, ReportState } from "../types/InitialAuth";
import { authInitialState, reportInitialState } from "../config/contants";
import { setAuthorization } from "../config/axios/interceptors";
import { retrase } from "../util/viewTransition";
import { setReportAuthorization } from "../config/axios/axiosReports";
import { loginReport } from "../services/reportService";
import { LoginForm } from "../pages/auth/LoginPage";

interface AuthState {
  reportState: ReportState;
  authState: InitialAuth;
  loading: boolean;
  syncAuth: () => void;
  signIn: (login: InitialAuth) => void;
  singnInReports: (login: LoginForm) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  reportState: reportInitialState,
  authState: authInitialState,
  loading: false,
  syncAuth: async () => {
    try {
      set({ loading: true });
      await retrase(1000);
      const storedState = window.localStorage.getItem("@auth");
      if (storedState) {
        const initialState: InitialAuth = JSON.parse(storedState);
        setAuthorization(initialState.token);
        set({ authState: initialState });
      }
      const storedReportState = window.localStorage.getItem("@authReport");
      if (storedReportState) {
        const initialState: ReportState = JSON.parse(storedReportState);
        setReportAuthorization(initialState.token);
        set({ reportState: initialState });
      }
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
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
  singnInReports: async (auth) => {
    try {
      set({ loading: true });
      const response = await loginReport(auth);

      if (!response.success) return;

      const authState = response.data! as ReportState;

      const newState = {
        ...get().reportState,
        ...authState,
      };

      set({ reportState: newState });
      setReportAuthorization(authState.token);
      window.localStorage.setItem("@authReport", JSON.stringify(newState));
      set({ loading: false });
    } catch (error) {
      console.error({ error });
      set({ loading: false, reportState: reportInitialState });
    }
  },
  logout: async () => {
    try {
      set({ loading: true });
      await retrase(1000);
      window.localStorage.clear();
      setAuthorization("");
      setReportAuthorization("");
      set({ authState: authInitialState, reportState: reportInitialState });
      set({ loading: false });
      return authInitialState;
    } catch (error) {
      console.error({ error });
      set({ loading: false });
    }
  },
}));
