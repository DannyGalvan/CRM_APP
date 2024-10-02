import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QueryKeys } from "../config/contants";
import {
  createCashReport,
  partialUpdateCashReport,
  updateCashReport,
} from "../services/cashReportService";
import { useCashReportStore } from "../store/useCashReportStore";
import { useErrorsStore } from "../store/useErrorsStore";
import { ApiResponse } from "../types/ApiResponse";
import { CashReportRequest } from "../types/CashReportRequest";
import { CashReportResponse } from "../types/CashReportResponse";
import { ValidationFailure } from "../types/ValidationFailure";
import { ApiError } from "../util/errors";
import { rebootScroll } from "../util/viewTransition";

export const useCashReport = () => {
  const { orders, getDetailsByCashReportId } = useCashReportStore();
  const client = useQueryClient();
  const { setError } = useErrorsStore();

  const updateDataToRefetch = async () => {
    await client.refetchQueries({
      queryKey: [QueryKeys.OrdersHasRoute],
      type: "all",
      exact: true,
    });

    await client.invalidateQueries({
      queryKey: [QueryKeys.Orders],
      type: "all",
      exact: false,
    });

    await client.invalidateQueries({
      queryKey: [QueryKeys.CashReports],
      type: "all",
      exact: false,
    });

    rebootScroll();
  };

  const create = async (
    form: CashReportRequest,
  ): Promise<ApiResponse<CashReportResponse | ValidationFailure[]>> => {
    form.orders = orders;

    const cashReportResponse = await createCashReport(form);

    if (!cashReportResponse.success) {
      const errors = cashReportResponse.data;

      return {
        data: errors,
        success: cashReportResponse.success,
        message: cashReportResponse.message,
        totalResults: 0,
      };
    }

    await updateDataToRefetch();

    return cashReportResponse;
  };

  const update = async (
    form: CashReportRequest,
  ): Promise<ApiResponse<CashReportResponse | ValidationFailure[]>> => {
    const savedDetails = await getDetailsByCashReportId(
      form.id ?? "",
      setError,
    );

    form.orders = [...orders, ...savedDetails.map((detail) => detail.order)];

    const cashReportResponse = await updateCashReport(form);

    if (!cashReportResponse.success) {
      const errors = cashReportResponse.data;

      return {
        data: errors,
        success: cashReportResponse.success,
        message: cashReportResponse.message,
        totalResults: 0,
      };
    }

    await updateDataToRefetch();

    const cashReportId = cashReportResponse.data as CashReportResponse;

    await getDetailsByCashReportId(cashReportId.id, setError);

    return cashReportResponse;
  };

  const deleteCashReport = async (id: string) => {
    try {
      const response = await partialUpdateCashReport({
        id: id,
        state: 0,
      });

      if (!response.success) {
        toast.error(`Error al eliminar reporte de caja ${response.message}`);
      } else {
        toast.success("Corte de caja eliminado con éxito");
      }

      await updateDataToRefetch();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        toast.error(`Error al eliminar el corte de caja ${error}`);
      }
    }
  };

  return { create, update, deleteCashReport };
};
