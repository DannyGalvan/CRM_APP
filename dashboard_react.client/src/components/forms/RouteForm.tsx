import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { OrderStates, QueryKeys } from "../../config/contants";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { ModalType } from "../../hooks/useModalStrategies";
import { initialRoute } from "../../pages/routes/CreateRoutePage";
import { getFilteredOrders } from "../../services/orderService";
import { getPilots } from "../../services/pilotService";
import { useErrorsStore } from "../../store/useErrorsStore";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { useRouteStore } from "../../store/useRouteStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { OrderResponse } from "../../types/OrderResponse";
import { RouteDetailsRequest } from "../../types/RouteDetailsRequest";
import { RouteDtoRequest, RouteDtoResponse } from "../../types/RouteDto";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { routeShema } from "../../util/validations/routeValidations";
import { OrderDetailResponseColumns } from "../columns/OrderDetailResponseColumns";
import { OrderResponseColumns } from "../columns/OrderResponseColumns";
import { Col } from "../grid/Col";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { Response } from "../messages/Response";
import { TableRoot } from "../table/TableRoot";

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
      <h1 className="text-2xl font-bold text-center">{text} Ruta</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
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
            className="py-4 mt-4 font-bold"
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
