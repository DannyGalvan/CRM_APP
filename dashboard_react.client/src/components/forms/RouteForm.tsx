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
import { TableColumn } from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../../types/OrderResponse";
import { ApiError } from "../../util/errors";
import { getFilteredOrders } from "../../services/orderService";
import { NotFound } from "../../pages/error/NotFound";
import { TableRoot } from "../table/TableRoot";
import { compactGrid } from "../../theme/tableTheme";
import { useRouteDetailStore } from "../../store/useRouteDetailsStore";
import { RouteDetailsRequest } from "../../types/RouteDetailsRequest";

interface RouteFormProps {
  initialForm: RouteDtoRequest | RouteDtoResponse;
  sendForm: (
    product: RouteDtoRequest,
  ) => Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const columns: TableColumn<any>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "name",
    name: "Nombre",
    selector: (data) => data?.customer?.fullName,
    omit: false,
    sortable: true,
  },
  {
    id: "total",
    name: "Total",
    selector: (data) => data.total,
    omit: false,
    sortable: true,
    maxWidth: "100px",
  },
  {
    id: "payment",
    name: "Pago",
    selector: (data) => data?.paymentType?.name,
    sortable: true,
    maxWidth: "150px",
    omit: false,
  },
  {
    id: "status",
    name: "Estado",
    selector: (data) => data?.orderState?.name,
    sortable: true,
    maxWidth: "150px",
    omit: false,
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "200px",
    omit: true,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "deliveryDate",
    name: "Entrega",
    selector: (data) => data.deliveryDate,
    sortable: true,
    maxWidth: "115px",
    omit: false,
  },
];

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
  const { add } = useRouteDetailStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<OrderResponse[]>,
    ApiError | undefined
  >({
    queryKey: ["ordersFiltered"],
    queryFn: () =>
      getFilteredOrders("OrderStateId:eq:667a0b4ea82250a2c13748c2"),
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

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

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
            defaultValue={route?.pilot?.id}
            errorMessage={errors?.pilotId}
            keyName="Name"
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
          <TableRoot
            columns={columns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            text="de las ordenes"
            styles={compactGrid}
            title={"Ordenes pendientes"}
            width={false}
            selectedRows={true}
            onSelectedRowsChange={(rows) => {
              const details : RouteDetailsRequest[] = rows.selectedRows.map((row : any)  => ({
                orderId: row.id,
                routeId: "",
                state: 1,
              }));
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
