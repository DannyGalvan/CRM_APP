import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
import { useErrorsStore } from "../store/useErrorsStore";
import { QueryKeys } from "../config/contants";
import { ApiError } from "../util/errors";
import { updateSearch } from "../obsevables/searchObservable";
import { RouteResponse } from "../types/RouteResponse";
import { rebootScroll } from "../util/viewTransition";

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

    rebootScroll();
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

    form.routeDetails = parseDetailsWithOutRoute.data;

    const response = await createRoute(form);

    await updateData();

    updateSearch(QueryKeys.Pilots, "");

    return response;
  };

  const update = async (
    form: RouteDtoRequest,
  ): Promise<ApiResponse<RouteDtoResponse | ValidationFailure[]>> => {
    let routeResponse;

    if (route.length === 0) {
      routeResponse = await updateRoute(form);

      await client.invalidateQueries({
        queryKey: [QueryKeys.Routes],
        type: "all",
        exact: false,
      });

      rebootScroll();

      return routeResponse;
    }

    route.forEach((detail) => (detail.routeId = form.id));

    const parseDetails = routeDetailsShemaArray.safeParse(route);

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

    form.routeDetails = parseDetails.data;

    routeResponse = await updateRoute(form);

    await updateData();

    const response = routeResponse.data as RouteResponse;

    await getRouteDetailsByRouteId(response.id, setError);

    return routeResponse;
  };

  const deleteRoute = async (id: string) => {
    try {
      const response = await partialUpdateRoute({
        id: id,
        state: 0,
        routeDetails: route,
      });

      if (!response.success) {
        toast.warning(`Error al eliminar la ruta ${response.message}`);

        const errors = response.data as ValidationFailure[];

        errors.forEach((error) => {
          toast.error(error.propertyName + " " + error.errorMessage);
        });

        return response;
      }

      await updateData();

      toast.success("Ruta eliminada correctamente");
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
