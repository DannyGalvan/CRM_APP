import { useQuery } from "@tanstack/react-query";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { useCashReportStore } from "../../store/useCashReportStore";
import { useErrorsStore } from "../../store/useErrorsStore";
import { ApiResponse } from "../../types/ApiResponse";
import { CashReportRequest } from "../../types/CashReportRequest";
import { CashReportResponse } from "../../types/CashReportResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { cashReportShema } from "../../util/validations/cashReportValidations";
import { OrderResponse } from "../../types/OrderResponse";
import { ApiError } from "../../util/errors";
import { getFilteredOrders } from "../../services/orderService";
import { OrderStates, QueryKeys } from "../../config/contants";
import { useEffect } from "react";
import { initialCashReport } from "../../pages/cashReport/CreateCashReportPage";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";
import { Input, Textarea } from "@nextui-org/input";
import { TableRoot } from "../table/TableRoot";
import { OrderResponseColumns } from "../columns/OrderResponseColumns";
import { compactGrid } from "../../theme/tableTheme";
import { Button } from "@nextui-org/button";
import { CashReportDetailResponseColumns } from "../columns/CashReportDetailResponseColumns";

interface CashReportFormProps {
  initialForm: CashReportRequest | CashReportResponse;
  sendForm: (
    route: CashReportRequest,
  ) => Promise<ApiResponse<CashReportResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const cashReportValidations = (request: CashReportRequest) => {
  let errors: ErrorObject = {};

  const parceRoute = cashReportShema.safeParse(request);

  if (!parceRoute.success) {
    errors = handleOneLevelZodError(parceRoute.error);
  }

  return errors;
};

export const CashReportForm = ({
  initialForm,
  sendForm,
  text,
  reboot,
}: CashReportFormProps) => {
  const { addOrders, savedOrders, loadingSavedRoutes, getTotalOrders } = useCashReportStore();
  const { setError } = useErrorsStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<OrderResponse[]>,
    ApiError | undefined
  >({
    queryKey: [QueryKeys.OrdersHasRoute],
    queryFn: () => getFilteredOrders(`OrderStateId:eq:${OrderStates.hasRoute}`),
  });

  const {
    form,
    errors,
    handleSubmit,
    handleChange,
    loading,
    success,
    message,
  } = useForm<CashReportRequest, CashReportResponse>(
    initialForm || initialCashReport,
    cashReportValidations,
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
      <h1 className="text-center text-2xl font-bold">{text} Reporte de Caja</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Input
            label="Nombre del cajero"
            name="cashierName"
            value={form.cashierName}
            onChange={handleChange}
            errorMessage={errors?.cashierName}
            isInvalid={!!errors?.cashierName}
            variant="underlined"
          />
          <Textarea
            label="Observaciones"
            labelPlacement="outside"
            placeholder="Ingresa observaciones del corte de caja"
            name="observations"
            value={form.observations}
            onChange={handleChange}
            errorMessage={errors?.observations}
            isInvalid={!!errors?.observations}
            variant="underlined"
          />
          {text === "Editar" && (
            <TableRoot
              columns={CashReportDetailResponseColumns}
              data={savedOrders ?? []}
              hasFilters={true}
              pending={loadingSavedRoutes}
              text="de las ordenes"
              styles={compactGrid}
              title={"Ordenes en el corte de caja"}
              width={false}
            />
          )}
          <span className="text-right font-bold text-cyan-700">Total del Corte: {getTotalOrders()}</span>
          <TableRoot
            columns={OrderResponseColumns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            text="de las ordenes"
            styles={compactGrid}
            title={"Ordenes listas para corte de caja"}
            width={false}
            selectedRows={true}
            onSelectedRowsChange={(rows) => {
              addOrders(rows.selectedRows);
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
            {text} Corte de Caja
          </Button>
        </form>
      </div>
    </Col>
  );
};
