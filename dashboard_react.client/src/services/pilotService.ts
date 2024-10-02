import { api } from "../config/axios/interceptors";
import { ApiResponse } from "../types/ApiResponse";
import { PilotRequest } from "../types/PilotRequest";
import { PilotResponse } from "../types/PilotResponse";
import { ValidationFailure } from "../types/ValidationFailure";

export const getPilots = async (filter?: string, page = 1, pageSize = 10) => {
  let response: ApiResponse<PilotResponse[]>;

  if (filter) {
    response = await api.get<object, ApiResponse<PilotResponse[]>>(
      `pilot?filters=${filter}&page=${page}&pageSize=${pageSize}`,
    );
  } else {
    response = await api.get<object, ApiResponse<PilotResponse[]>>(
      `pilot?page=${page}&pageSize=${pageSize}`,
    );
  }

  return response;
};

export const createPilot = async (product: PilotRequest) => {
  const response = await api.post<
    PilotRequest,
    ApiResponse<PilotResponse | ValidationFailure[]>
  >("/pilot", product);

  return response;
};

export const updatePilot = async (product: PilotRequest) => {
  const response = await api.put<
    PilotRequest,
    ApiResponse<PilotResponse | ValidationFailure[]>
  >(`/pilot`, product);

  return response;
};
