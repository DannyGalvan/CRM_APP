import { toAllOperations } from "../util/converted";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const { authState, loading, logout, signIn, syncAuth, singnInReports } = useAuthStore();

  const {
    email,
    isLoggedIn,
    operations,
    token,
    userName,
    name,
    redirect,
    userId,
  } = authState;

  const allOperations = toAllOperations(operations);

  return {
    email,
    isLoggedIn,
    logout,
    signIn,
    token,
    userName,
    name,
    redirect,
    operations,
    allOperations,
    userId,
    loading,
    syncAuth,
    singnInReports,
  };
};
