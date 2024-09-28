import { Navigate } from "react-router-dom";

import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedLoginProps {
  children: React.ReactNode;
}

const ProtectedLogin = ({ children }: ProtectedLoginProps) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={nameRoutes.root} />;
  }

  return children;
};

export default ProtectedLogin;
