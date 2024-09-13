import { useQueryClient } from "@tanstack/react-query";
import { useCashReportStore } from "../store/useCashReportStore";
import { useErrorsStore } from "../store/useErrorsStore";
import { CashReportRequest } from "../types/CashReportRequest";
import { ApiResponse } from "../types/ApiResponse";
import { CashReportResponse } from "../types/CashReportResponse";
import { ValidationFailure } from "../types/ValidationFailure";
import {
  cashReportDetailsShemaArray,
  cashReportDetailsWithOutCashReportShemaArray,
} from "../util/validations/cashResportDetailsValidations";
import { handleOneLevelZodError } from "../util/converted";
import { toast } from "react-toastify";
import {
  createCashReport,
  partialUpdateCashReport,
  updateCashReport,
} from "../services/cashReportService";
import { CashReportDetailsRequest } from "../types/CashReportDetailRequest";
import { bulkCreateCashReportDetail } from "../services/cashReportDetailService";
import { bulkPartialUpdateOrder } from "../services/orderService";
import { OrderStates } from "../config/contants";
import { ApiError } from "../util/errors";

export const useCashReport = () => {
  const { orders, getDetailsByCashReportId } = useCashReportStore();
  const client = useQueryClient();
  const { setError } = useErrorsStore();

  const updateDataToRefetch = async () => {
    await client.refetchQueries({
      queryKey: ["ordersHasRoute"],
      type: "all",
      exact: true,
    });

    await client.invalidateQueries({
      queryKey: ["orders"],
      type: "all",
      exact: false,
    });

    await client.invalidateQueries({
      queryKey: ["cashReports"],
      type: "all",
      exact: true,
    });
  };

  const create = async (
    form: CashReportRequest,
  ): Promise<ApiResponse<CashReportResponse | ValidationFailure[]>> => {
    let details: CashReportDetailsRequest[] = orders.map((order) => ({
      orderId: order.id,
      cashReportId: "",
    }));

    const parseDetailsWithOutCashReport =
      cashReportDetailsWithOutCashReportShemaArray.safeParse(details);

    if (!parseDetailsWithOutCashReport.success) {
      const detailsError = handleOneLevelZodError(
        parseDetailsWithOutCashReport.error,
      );

      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [],
        success: false,
        message: "detalles de ruta no válidos",
      };
    }

    form.orders = orders;

    const cashReportResponse = await createCashReport(form);

    if (!cashReportResponse.success) {
      const errors = cashReportResponse.data;

      return {
        data: errors,
        success: cashReportResponse.success,
        message: cashReportResponse.message,
      };
    }

    const cashReportSuccess = cashReportResponse.data as CashReportResponse;

    details = orders.map((order) => ({
      orderId: order.id,
      cashReportId: cashReportSuccess.id,
    }));

    const parseDetails = cashReportDetailsShemaArray.safeParse(details);

    if (!parseDetails.success) {
      const detailsError = handleOneLevelZodError(parseDetails.error);
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [],
        success: false,
        message: "Error validando detalles de ruta",
      };
    }

    const bulkResponse = await bulkCreateCashReportDetail({
      cashReportDetails: parseDetails.data,
      createdBy: "",
    });

    if (!bulkResponse.success) {
      const errors = bulkResponse.data as ValidationFailure[];
      return {
        data: errors,
        success: bulkResponse.success,
        message: bulkResponse.message,
      };
    }

    const bulkOrderResponse = await bulkPartialUpdateOrder({
      orders: parseDetails.data.map((detail) => ({
        id: detail.orderId,
        orderStateId: OrderStates.delivered,
      })),
      createdBy: "",
    });

    if (!bulkOrderResponse.success) {
      const errors = bulkOrderResponse.data as ValidationFailure[];
      return {
        data: errors,
        success: bulkOrderResponse.success,
        message: bulkOrderResponse.message,
      };
    }

    await updateDataToRefetch();

    return cashReportResponse;
  };

  const update = async (
    form: CashReportRequest,
  ): Promise<ApiResponse<CashReportResponse | ValidationFailure[]>> => {
    const savedDetails = await getDetailsByCashReportId(form.id!, setError);

    form.orders = [...orders, ...savedDetails.map((detail) => detail.order)];

    const cashReportResponse = await updateCashReport(form);

    if (!cashReportResponse.success) {
      const errors = cashReportResponse.data;

      return {
        data: errors,
        success: cashReportResponse.success,
        message: cashReportResponse.message,
      };
    }

    if (orders.length === 0) {
      await updateDataToRefetch();

      return cashReportResponse;
    }

    const cashReportSuccess = cashReportResponse.data as CashReportResponse;

    const details: CashReportDetailsRequest[] = orders.map((order) => ({
      orderId: order.id,
      cashReportId: cashReportSuccess.id,
    }));

    const parseDetails = cashReportDetailsShemaArray.safeParse(details);

    if (!parseDetails.success) {
      const detailsError = handleOneLevelZodError(parseDetails.error);
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [],
        success: false,
        message: "Error validando detalles de ruta",
      };
    }

    const bulkResponse = await bulkCreateCashReportDetail({
      cashReportDetails: parseDetails.data,
      createdBy: "",
    });

    if (!bulkResponse.success) {
      const errors = bulkResponse.data as ValidationFailure[];
      return {
        data: errors,
        success: bulkResponse.success,
        message: bulkResponse.message,
      };
    }

    const bulkOrderResponse = await bulkPartialUpdateOrder({
      orders: parseDetails.data.map((detail) => ({
        id: detail.orderId,
        orderStateId: OrderStates.delivered,
      })),
      createdBy: "",
    });

    if (!bulkOrderResponse.success) {
      const errors = bulkOrderResponse.data as ValidationFailure[];
      return {
        data: errors,
        success: bulkOrderResponse.success,
        message: bulkOrderResponse.message,
      };
    }    

    await updateDataToRefetch();

    await getDetailsByCashReportId(cashReportSuccess.id, setError);

    return cashReportResponse;
  };

  const deleteCashReport = async (id: string) => {
    try {
      const response = await partialUpdateCashReport({
        id: id,
        state: 0,
      });

      if (!response.data) {
        toast.error(`Error al eliminar la ruta ${response.message}`);
      }

      const ordersToDisengage = await getDetailsByCashReportId(id, setError);

      const bulkOrderResponse = await bulkPartialUpdateOrder({
        orders: ordersToDisengage.map((detail) => ({
          id: detail.orderId,
          orderStateId: OrderStates.hasRoute,
        })),
        createdBy: "",
      });

      if (!bulkOrderResponse.success) {
        toast.error(
          `Error al desligar las ordenes de la ruta ${bulkOrderResponse.message}`,
        );
      } else {
        toast.success("Ruta eliminada con éxito");
      }

      await updateDataToRefetch();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        toast.error(`Error al eliminar la ruta ${error}`);
      }
    }
  };

  return { create, update, deleteCashReport };
};
