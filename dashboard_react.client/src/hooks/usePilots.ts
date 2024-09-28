import { useQueryClient } from "@tanstack/react-query";

import { usePilotStore } from "../store/usePilotStore";
import { PilotRequest } from "../types/PilotRequest";
import { createPilot, updatePilot } from "../services/pilotService";
import { QueryKeys } from "../config/contants";

export const usePilots = () => {
  const client = useQueryClient();
  const { filterPilot } = usePilotStore();

  const create = async (pilot: PilotRequest) => {
    const response = await createPilot(pilot);

    if (response.success) {
      client.refetchQueries({
        queryKey: [QueryKeys.Pilots],
        type: "all",
        exact: false,
      });
    }

    return response;
  };

  const update = async (pilot: PilotRequest) => {
    const response = await updatePilot(pilot);

    client.refetchQueries({
      queryKey: [
        QueryKeys.Pilots,
        filterPilot.filter,
        "",
        "",
        filterPilot.page,
        filterPilot.pageSize,
      ],
      type: "all",
      exact: true,
    });

    return response;
  };

  return { create, update };
};
