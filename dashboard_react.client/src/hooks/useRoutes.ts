import { useQueryClient } from "@tanstack/react-query";
import { RouteDtoRequest, RouteDtoResponse } from "../types/RouteDto";
import { useRouteDetailStore } from "../store/useRouteDetailsStore";
import {
  createRoute,
  partialUpdateRoute,
  updateRoute,
} from "../services/routeService";
import { ValidationFailure } from "../types/ValidationFailure";
import { ApiResponse } from "../types/ApiResponse";
import {
  routeDetailsShemaArray,
  routeDetailsWithRouteShemaArray,
} from "../util/validations/routeDetailsValidations";
import { handleOneLevelZodError } from "../util/converted";
import { toast } from "react-toastify";
import { bulkCreateRouteDetail } from "../services/routeDetailService";
import { bulkPartialUpdateOrder } from "../services/orderService";
import { RouteDetailsResponse } from "../types/RouteDetailsResponse";
import { useErrorsStore } from "../store/useErrorsStore";
import { OrderStates, QueryKeys } from "../config/contants";
import { ApiError } from "../util/errors";
import { updateSearch } from "../obsevables/searchObservable";

export const useRoutes = () => {
  const { route, getRouteDetailsByRouteId } = useRouteDetailStore();
  const client = useQueryClient();
  const { setError } = useErrorsStore();

  const updateData = async () => {
    await client.refetchQueries({
      queryKey: [QueryKeys.OrdersFiltered],
      type: "all",
      exact: true,
    });

    await client.invalidateQueries({
      queryKey: [QueryKeys.Orders],
      type: "all",
      exact: false,
    });

    await client.invalidateQueries({
      queryKey: [QueryKeys.Routes],
      type: "all",
      exact: false,
    });

    await client.refetchQueries({
      queryKey: [QueryKeys.OrdersHasRoute],
      type: "all",
      exact: true,
    });

    updateSearch(QueryKeys.Pilots, "");
  };

  const create = async (
    form: RouteDtoRequest,
  ): Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>> => {
    const parseDetailsWithOutRoute =
      routeDetailsWithRouteShemaArray.safeParse(route);

    if (!parseDetailsWithOutRoute.success) {
      const detailsError = handleOneLevelZodError(
        parseDetailsWithOutRoute.error,
      );
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [],
        success: false,
        message: "detalles de ruta no válidos",
        totalResults: 1,
      };
    }

    const routeResponse = await createRoute(form);

    if (!routeResponse.success) {
      const errors = routeResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: routeResponse.success,
        message: routeResponse.message,
        totalResults: 1,
      };
    }

    const routeSuccess = routeResponse.data as RouteDtoResponse;

    route.forEach((detail) => (detail.routeId = routeSuccess.id));

    const parseDetails = routeDetailsShemaArray.safeParse(route);

    if (!parseDetails.success) {
      const detailsError = handleOneLevelZodError(parseDetails.error);
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [],
        success: false,
        message: "Error validando detalles de ruta",
        totalResults: 1,
      };
    }

    const bulkResponse = await bulkCreateRouteDetail({
      routeDetails: parseDetails.data,
      createdBy: "",
    });

    if (!bulkResponse.success) {
      const errors = bulkResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: bulkResponse.success,
        message: bulkResponse.message,
        totalResults: 1,
      };
    }

    const bulkOrderResponse = await bulkPartialUpdateOrder({
      orders: parseDetails.data.map((detail) => ({
        id: detail.orderId,
        orderStateId: OrderStates.hasRoute,
      })),
      createdBy: "",
    });

    if (!bulkOrderResponse.success) {
      const errors = bulkOrderResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: bulkOrderResponse.success,
        message: bulkOrderResponse.message,
        totalResults: 1,
      };
    }

    await updateData();

    const response: ApiResponse<RouteDtoResponse | ValidationFailure[]> = {
      data: {
        id: routeSuccess.id,
        observations: routeSuccess.observations,
        pilotId: routeSuccess.pilotId,
        state: routeSuccess.state,
        createdAt: routeSuccess.createdAt,
        createdBy: routeSuccess.createdBy,
        updatedAt: routeSuccess.updatedAt,
        pilot: routeSuccess.pilot,
        updatedBy: routeSuccess.updatedBy,
        details: bulkResponse.data as RouteDetailsResponse[],
      },
      success: true,
      message: "Ruta creada con éxito",
      totalResults: 1,
    };

    return response;
  };

  const update = async (form: RouteDtoRequest): Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>> => {
    const routeResponse = await updateRoute(form);

    if (!routeResponse.success) {
      const errors = routeResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: routeResponse.success,
        message: routeResponse.message,
        totalResults: 1,
      };
    }

    if (route.length === 0) {
      await client.invalidateQueries({
        queryKey: ["routes"],
        type: "active",
        exact: true,
      });

      return {
        data: [] as RouteDtoResponse | ValidationFailure[],
        success: true,
        message: "Ruta actualizada con éxito",
        totalResults: 1,
      };
    }

    const routeSuccess = routeResponse.data as RouteDtoResponse;

    route.forEach((detail) => (detail.routeId = routeSuccess.id));

    let parseDetails = routeDetailsShemaArray.safeParse(route);

    if (!parseDetails.success) {
      const detailsError = handleOneLevelZodError(parseDetails.error);
      Object.entries(detailsError).forEach(([_, value]) => {
        toast.error(value);
      });

      return {
        data: [] as RouteDtoResponse | ValidationFailure[],
        success: false,
        message: "Error validando detalles de ruta",
        totalResults: 1,
      };
    }

    const bulkResponse = await bulkCreateRouteDetail({
      routeDetails: parseDetails.data,
      createdBy: "",
    });

    if (!bulkResponse.success) {
      const errors = bulkResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: bulkResponse.success,
        message: bulkResponse.message,
        totalResults: 1,
      };
    }

    const bulkOrderResponse = await bulkPartialUpdateOrder({
      orders: parseDetails.data.map((detail) => ({
        id: detail.orderId,
        orderStateId: OrderStates.hasRoute,
      })),
      createdBy: "",
    });

    if (!bulkOrderResponse.success) {
      const errors = bulkOrderResponse.data as
        | ValidationFailure[]
        | RouteDtoResponse;
      return {
        data: errors,
        success: bulkOrderResponse.success,
        message: bulkOrderResponse.message,
        totalResults: 1,
      };
    }

    await updateData();

    await getRouteDetailsByRouteId(routeSuccess.id, setError);

    const response: ApiResponse<RouteDtoResponse | ValidationFailure[]> = {
      data: {
        id: routeSuccess.id,
        observations: routeSuccess.observations,
        pilotId: routeSuccess.pilotId,
        state: routeSuccess.state,
        createdAt: routeSuccess.createdAt,
        createdBy: routeSuccess.createdBy,
        updatedAt: routeSuccess.updatedAt,
        pilot: routeSuccess.pilot,
        updatedBy: routeSuccess.updatedBy,
        details: bulkResponse.data as RouteDetailsResponse[],
      },
      success: true,
      message: "Ruta creada con éxito",
      totalResults: 1,
    };

    return response;
  };

  const deleteRoute = async (id: string) => {
    try {
      const response = await partialUpdateRoute({
        id: id,
        state: 0,
      });

      if (!response.success) {
        toast.warning(`Error al eliminar la ruta ${response.message}`);

        const errors = response.data as ValidationFailure[];

        errors.forEach((error) => {
          toast.error(error.propertyName + " " + error.errorMessage);
        });

        return response;
      }

      const ordersToDisengage = await getRouteDetailsByRouteId(id, setError);

      const bulkOrderResponse = await bulkPartialUpdateOrder({
        orders: ordersToDisengage.map((detail) => ({
          id: detail.orderId,
          orderStateId: OrderStates.create,
        })),
        createdBy: "",
      });

      if (!bulkOrderResponse.success) {
        toast.error(
          `Error al desligar las ordenes de la ruta ${bulkOrderResponse.message}`,
        );

        return;
      } else {
        toast.success("Ruta eliminada con éxito");

        await updateData();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        toast.error(`Error al eliminar la ruta ${error}`);
      }
    }
  };

  return {
    create,
    update,
    deleteRoute,
  };
};
