import { Navigate } from "react-router-dom";
import { nameRoutes } from "../../config/contants";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { isLoggedIn, redirect } = useAuth();

  console.log({isLoggedIn, redirect});

  if (!isLoggedIn) {
    return <Navigate to={nameRoutes.login} />;
  }

  if (redirect) {
    return <Navigate to={nameRoutes.changePassword} />;
  }

  return children;
};

export default Protected;
