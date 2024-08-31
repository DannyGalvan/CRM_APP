import { Suspense } from "react";
import { RouteForm } from "../../components/forms/RouteForm";
import { Col } from "../../components/grid/Col";
import Protected from "../../routes/middlewares/Protected";
import { ApiResponse } from "../../types/ApiResponse";
import { RouteDtoRequest, RouteDtoResponse } from "../../types/RouteDto";
import { ValidationFailure } from "../../types/ValidationFailure";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { ModalCreateItem } from "../../components/modals/ModalCreateItem";
import { toast } from "react-toastify";
import { routeDetailsShemaArray } from "../../util/validations/routeDetailsValidations";
import { handleOneLevelZodError } from "../../util/converted";

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
    {
      id: "",
      orderId: "",
      routeId: "1",
      state: 1,
    },
  ],
};

export const CreateRoutePage = () => {
  const create = (
    form: RouteDtoRequest,
  ): Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>> => {
    const parseDetails = routeDetailsShemaArray.safeParse(form.details);

    if (!parseDetails.success) {
      const detailsError = handleOneLevelZodError(parseDetails.error);
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });
    }

    console.log("create route");

    const response: RouteDtoResponse = {
      id: "1",
      observations: "Observations",
      pilotId: "1",
      state: 1,
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      pilot: {
        id: "1",
        name: "Pilot",
        lastName: "Pilot",
        phone: "123456",
        email: "",
        state: 1,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        license: "123456",
      },
      updatedBy: "",
      details: [],
    };

    return new Promise((resolve) => {
      resolve({
        data: response,
        success: true,
        message: "Route created",
      });
    });
  };

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
