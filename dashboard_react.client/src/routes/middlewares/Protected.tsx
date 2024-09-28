import { Navigate } from "react-router-dom";

import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";
import { useErrorsStore } from "../../store/useErrorsStore";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { isLoggedIn, redirect } = useAuth();
  const { error } = useErrorsStore();

  if (!isLoggedIn) {
    return <Navigate to={nameRoutes.login} />;
  }

  if (error) {
    return <Navigate to={nameRoutes.error} />;
  }

  if (redirect) {
    return <Navigate to={nameRoutes.changePassword} />;
  }

  return children;
};

export default Protected;
