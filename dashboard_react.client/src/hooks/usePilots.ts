import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../types/ApiResponse";
import { usePilotStore } from "../store/usePilotStore";
import { PilotRequest } from "../types/PilotRequest";
import { createPilot, updatePilot } from "../services/pilotService";
import { PilotResponse } from "../types/PilotResponse";

export const usePilots = () => {
  const client = useQueryClient();
  const { add } = usePilotStore();

  const create = async (pilot: PilotRequest) => {
    const response = await createPilot(pilot);

    client.refetchQueries({
      queryKey: ["pilots"],
      type: "active",
      exact: true,
    });

    return response;
  };

  const update = async (pilot: PilotRequest) => {
    const response = await updatePilot(pilot);

    await client.refetchQueries({
      queryKey: ["pilots"],
      type: "active",
      exact: true,
    });

    const pilots = client.getQueryData<ApiResponse<PilotResponse[]>>([
      "pilots",
    ]);

    if (pilots != undefined) {
      const find = pilots.data?.find((c) => c.id === pilot.id);

      if (find != undefined) {
        find.createdAt = null;
        find.updatedAt = null;
        find.updatedBy = null;
        find.createdBy = null;
      }

      find && add(find);
    }

    return response;
  };

  return { create, update };
};
