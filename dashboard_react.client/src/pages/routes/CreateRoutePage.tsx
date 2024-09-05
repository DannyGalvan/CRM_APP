import { Suspense } from "react";
import { RouteForm } from "../../components/forms/RouteForm";
import { Col } from "../../components/grid/Col";
import Protected from "../../routes/middlewares/Protected";
import { RouteDtoRequest } from "../../types/RouteDto";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { ModalCreateItem } from "../../components/modals/ModalCreateItem";
import { useRoutes } from "../../hooks/useRoutes";

export const initialRoute: RouteDtoRequest = {
  observations: "",
  pilotId: "",
  state: 1,
  details: [
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
      <div className="page-view container flex flex-col flex-wrap items-center justify-center">
        <Col md={12}>
          <RouteForm
            initialForm={initialRoute}
            sendForm={create}
            text="Crear"
            reboot
          />
        </Col>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItem />
      </Suspense>
    </Protected>
  );
};
