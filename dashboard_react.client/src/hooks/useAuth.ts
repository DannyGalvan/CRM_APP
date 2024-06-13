import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toAllOperations } from '../util/converted';

export const useAuth = () => {
  const { authState, logout, signIn } = useContext(AuthContext);
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
  };
};
