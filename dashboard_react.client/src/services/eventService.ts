import { EventApi, EventInput } from "@fullcalendar/core/index.js";
import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";

export const getEvents = async () => {
  const response: EventApi[] = await api.get<any, EventApi[], any>("/event");
  return response;
};

export const createEvent = async (event: EventInput) => {
  const response: ApiResponse<EventApi> = await api.post<
    any,
    ApiResponse<EventApi>,
    any
  >("/event", event);
  return response;
};

export const updateEvent = async (event: EventInput) => {
  const response: ApiResponse<EventApi> = await api.put<
    any,
    ApiResponse<EventApi>,
    any
  >("/event", event);
  return response;
};

export const partialUpdateEvent = async (event: EventInput) => {
  const response: ApiResponse<EventApi> = await api.patch<
    any,
    ApiResponse<EventApi>,
    any
  >("/event", event);
  return response;
};
