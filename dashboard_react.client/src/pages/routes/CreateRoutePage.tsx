import { Suspense } from "react";

import { RouteForm } from "../../components/forms/RouteForm";
import { Col } from "../../components/grid/Col";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useRoutes } from "../../hooks/useRoutes";
import Protected from "../../routes/middlewares/Protected";
import { RouteDtoRequest } from "../../types/RouteDto";

export const initialRoute: RouteDtoRequest = {
  observations: "",
  pilotId: "",
  state: 1,
  routeDetails: [
    {
      id: "",
      orderId: "",
      routeId: "",
      state: 1,
    },
  ],
};

export const CreateRoutePage = () => {
  const { create } = useRoutes();

  return (
    <Protected>
      <div className="flex flex-col flex-wrap justify-center items-center page-view">
        <Col md={12}>
          <RouteForm
            reboot
            initialForm={initialRoute}
            sendForm={create}
            text="Crear"
          />
        </Col>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
