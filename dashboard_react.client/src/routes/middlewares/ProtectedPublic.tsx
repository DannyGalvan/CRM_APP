import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";
import { useErrorsStore } from "../../store/useErrorsStore";

interface ProtectedPublicProps {
  children: ReactNode;
}

const ProtectedPublic = ({ children }: ProtectedPublicProps) => {
  const { isLoggedIn } = useAuth();
  const { error } = useErrorsStore();

  if (!isLoggedIn) {
    return <Navigate to={nameRoutes.login} />;
  }

  if (error) {
    return <Navigate to={nameRoutes.error} />;
  }

  return children;
};

export default ProtectedPublic;
