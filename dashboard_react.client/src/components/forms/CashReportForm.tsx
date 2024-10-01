import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { OrderStates, QueryKeys } from "../../config/contants";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialCashReport } from "../../pages/cashReport/CreateCashReportPage";
import { getFilteredOrders } from "../../services/orderService";
import { useCashReportStore } from "../../store/useCashReportStore";
import { useErrorsStore } from "../../store/useErrorsStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { CashReportRequest } from "../../types/CashReportRequest";
import { CashReportResponse } from "../../types/CashReportResponse";
import { OrderResponse } from "../../types/OrderResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { cashReportShema } from "../../util/validations/cashReportValidations";
import { CashReportDetailResponseColumns } from "../columns/CashReportDetailResponseColumns";
import { OrderResponseColumns } from "../columns/OrderResponseColumns";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";
import { TableRoot } from "../table/TableRoot";

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
  const { addOrders, savedOrders, loadingSavedRoutes, getTotalOrders } =
    useCashReportStore();
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
      <h1 className="text-2xl font-bold text-center">{text} Reporte de Caja</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Input
            errorMessage={errors?.cashierName}
            isInvalid={!!errors?.cashierName}
            label="Nombre del cajero"
            name="cashierName"
            value={form.cashierName}
            variant="underlined"
            onChange={handleChange}
          />
          <Textarea
            errorMessage={errors?.observations}
            isInvalid={!!errors?.observations}
            label="Observaciones"
            labelPlacement="outside"
            name="observations"
            placeholder="Ingresa observaciones del corte de caja"
            value={form.observations}
            variant="underlined"
            onChange={handleChange}
          />
          {text === "Editar" && (
            <TableRoot
              columns={CashReportDetailResponseColumns}
              data={savedOrders ?? []}
              hasFilters={true}
              pending={loadingSavedRoutes}
              styles={compactGrid}
              text="de las ordenes"
              title={"Ordenes en el corte de caja"}
              width={false}
            />
          )}
          <span className="font-bold text-right text-cyan-700">
            Total del Corte: {getTotalOrders()}
          </span>
          <TableRoot
            columns={OrderResponseColumns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            selectedRows={true}
            styles={compactGrid}
            text="de las ordenes"
            title={"Ordenes listas para corte de caja"}
            width={false}
            onSelectedRowsChange={(rows) => {
              addOrders(rows.selectedRows);
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
            {text} Corte de Caja
          </Button>
        </form>
      </div>
    </Col>
  );
};
