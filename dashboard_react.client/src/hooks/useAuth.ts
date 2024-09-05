import { toAllOperations } from "../util/converted";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const { authState, logout, signIn, syncAuth } = useAuthStore();

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
    syncAuth,
  };
};
