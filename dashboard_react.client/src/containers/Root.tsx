import { Outlet, useNavigation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../pages/LoadingPage";
import { Layout } from "./Layout";
import { LayoutLogin } from "./LayoutLogin";

export const Root = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Layout>
      {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
    </Layout>
  ) : (
    <LayoutLogin>
      {navigation.state === "loading" ? <LoadingPage /> : <Outlet />}
    </LayoutLogin>
  );
};
