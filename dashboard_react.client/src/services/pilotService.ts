import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { PilotRequest } from "../types/PilotRequest";
import { PilotResponse } from "../types/PilotResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getPilots = async (filter?: string, page = 1, pageSize = 10) => {
  let response;

  if (filter) {
    response = await api.get<any, ApiResponse<PilotResponse[]>, any>(
      `pilot?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<any, ApiResponse<PilotResponse[]>, any>(
      `pilot?page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createPilot = async (product: PilotRequest) => {
  const response = await api.post<
    CustomerRequest,
    ApiResponse<PilotResponse | ValidationFailure[]>,
    any
  >("/pilot", product);

  return response;
};

export const updatePilot = async (product: PilotRequest) => {
  const response = await api.put<
    CustomerRequest,
    ApiResponse<PilotResponse | ValidationFailure[]>,
    any
  >(`/pilot`, product);

  return response;
};
