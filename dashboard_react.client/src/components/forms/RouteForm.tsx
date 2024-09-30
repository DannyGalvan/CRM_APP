import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { ErrorObject, useForm } from "../../hooks/useForm";
import { ApiResponse } from "../../types/ApiResponse";
import { RouteDtoRequest, RouteDtoResponse } from "../../types/RouteDto";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { routeShema } from "../../util/validations/routeValidations";
import { useRouteStore } from "../../store/useRouteStore";
import { initialRoute } from "../../pages/routes/CreateRoutePage";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { getPilots } from "../../services/pilotService";
import { OrderResponse } from "../../types/OrderResponse";
import { ApiError } from "../../util/errors";
import { getFilteredOrders } from "../../services/orderService";
import { TableRoot } from "../table/TableRoot";
import { compactGrid } from "../../theme/tableTheme";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { RouteDetailsRequest } from "../../types/RouteDetailsRequest";
import { useErrorsStore } from "../../store/useErrorsStore";
import { OrderResponseColumns } from "../columns/OrderResponseColumns";
import { OrderDetailResponseColumns } from "../columns/OrderDetailResponseColumns";
import { OrderStates, QueryKeys } from "../../config/contants";
import { ModalType } from "../../hooks/useModalStrategies";

interface RouteFormProps {
  initialForm: RouteDtoRequest | RouteDtoResponse;
  sendForm: (
    route: RouteDtoRequest,
  ) => Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const routeValidations = (request: RouteDtoRequest) => {
  let errors: ErrorObject = {};

  const parceRoute = routeShema.safeParse(request);

  if (!parceRoute.success) {
    errors = handleOneLevelZodError(parceRoute.error);
  }

  return errors;
};

export const RouteForm = ({
  initialForm,
  sendForm,
  text,
  reboot,
}: RouteFormProps) => {
  const { route } = useRouteStore();
  const { setError } = useErrorsStore();
  const {
    add,
    savedRoutes: routeDetail,
    loading: loadingDetails,
  } = useRouteDetailStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<OrderResponse[]>,
    ApiError | undefined
  >({
    queryKey: [QueryKeys.OrdersFiltered],
    queryFn: () =>
      getFilteredOrders(`OrderStateId:eq:${OrderStates.create}`, 1, 500),
  });

  const {
    form,
    errors,
    handleSubmit,
    handleChange,
    loading,
    success,
    message,
  } = useForm<RouteDtoRequest, RouteDtoResponse>(
    initialForm ?? initialRoute,
    routeValidations,
    sendForm,
    reboot,
  );

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return (
    <Col md={12}>
      <h1 className="text-center text-2xl font-bold">{text} Ruta</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <CatalogueSearch
            defaultValue={route?.pilot?.fullName}
            entity="Pilotos"
            errorMessage={errors?.pilotId}
            keyName="FullName"
            name="pilotId"
            queryFn={getPilots}
            querykey={QueryKeys.Pilots as ModalType}
            setFormValue={handleChange}
          />
          <Textarea
            errorMessage={errors?.observations}
            isInvalid={!!errors?.observations}
            label="Description"
            labelPlacement="outside"
            name="observations"
            placeholder="Ingresa observaciones de la ruta"
            value={form.observations}
            variant="underlined"
            onChange={handleChange}
          />
          {text === "Editar" && (
            <TableRoot
              columns={OrderDetailResponseColumns}
              data={routeDetail ?? []}
              hasFilters={true}
              pending={loadingDetails}
              styles={compactGrid}
              text="de las ordenes"
              title={"Ordenes en la ruta"}
              width={false}
            />
          )}
          <TableRoot
            columns={OrderResponseColumns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            selectedRows={true}
            styles={compactGrid}
            text="de las ordenes"
            title={"Ordenes pendientes"}
            width={false}
            onSelectedRowsChange={(rows) => {
              const details: RouteDetailsRequest[] = rows.selectedRows.map(
                (row: any) => ({
                  orderId: row.id,
                  routeId: "",
                  state: 1,
                }),
              );
              add(details);
            }}
          />
          <Button
            fullWidth
            className="mt-4 py-4 font-bold"
            color="primary"
            isLoading={loading}
            radius="md"
            size="lg"
            type="submit"
            variant="shadow"
          >
            {text} Ruta
          </Button>
        </form>
      </div>
    </Col>
  );
};
