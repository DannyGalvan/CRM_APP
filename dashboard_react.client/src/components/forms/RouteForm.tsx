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
import { Button } from "@nextui-org/button";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { getPilots } from "../../services/pilotService";
import { Textarea } from "@nextui-org/input";
import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../../types/OrderResponse";
import { ApiError } from "../../util/errors";
import { getFilteredOrders } from "../../services/orderService";
import { TableRoot } from "../table/TableRoot";
import { compactGrid } from "../../theme/tableTheme";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { RouteDetailsRequest } from "../../types/RouteDetailsRequest";
import { useErrorsStore } from "../../store/useErrorsStore";
import { useEffect } from "react";
import { OrderResponseColumns } from "../columns/OrderResponseColumns";
import { OrderDetailResponseColumns } from "../columns/OrderDetailResponseColumns";
import { OrderStates } from "../../config/contants";

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
    queryKey: ["ordersFiltered"],
    queryFn: () =>
      getFilteredOrders(`OrderStateId:eq:${OrderStates.create}`),
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
            name="pilotId"
            querykey="Pilots"
            entity="Pilotos"
            setFormValue={handleChange}
            defaultValue={route?.pilot?.fullName}
            errorMessage={errors?.pilotId}
            keyName="FullName"
            queryFn={getPilots}
          />
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Ingresa observaciones de la ruta"
            name="observations"
            value={form.observations}
            onChange={handleChange}
            errorMessage={errors?.observations}
            isInvalid={!!errors?.observations}
            variant="underlined"
          />
          {text === "Editar" && (
            <TableRoot
              columns={OrderDetailResponseColumns}
              data={routeDetail ?? []}
              hasFilters={true}
              pending={loadingDetails}
              text="de las ordenes"
              styles={compactGrid}
              title={"Ordenes en la ruta"}
              width={false}
            />
          )}
          <TableRoot
            columns={OrderResponseColumns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            text="de las ordenes"
            styles={compactGrid}
            title={"Ordenes pendientes"}
            width={false}
            selectedRows={true}
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
            isLoading={loading}
            type="submit"
            radius="md"
            size="lg"
            color="primary"
            fullWidth
            variant="shadow"
            className="mt-4 py-4 font-bold"
          >
            {text} Ruta
          </Button>
        </form>
      </div>
    </Col>
  );
};
