import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  operation: number;
}

const ProtectedRoute = ({ children, operation }: ProtectedRouteProps) => {
  const { isLoggedIn, allOperations, redirect } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={nameRoutes.login} />;
  }

  if (!allOperations.some((op) => op.id === operation))
    return <Navigate to={nameRoutes.forbidden} />;

  if (redirect) {
    return <Navigate to={nameRoutes.changePassword} />;
  }

  return children;
};

export default ProtectedRoute;
