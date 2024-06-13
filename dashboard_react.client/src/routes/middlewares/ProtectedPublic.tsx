import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedPublicProps {
  children: ReactNode;
}

const ProtectedPublic = ({ children }: ProtectedPublicProps) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={nameRoutes.login} />;
  }

  return children;
};

export default ProtectedPublic;
