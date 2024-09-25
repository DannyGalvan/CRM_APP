import { useQuery } from "@tanstack/react-query";
import { usePilots } from "../../hooks/usePilots";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { usePilotStore } from "../../store/usePilotStore";
import { PilotResponse } from "../../types/PilotResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { ApiResponse } from "../../types/ApiResponse";
import { ApiError } from "../../util/errors";
import { getPilots } from "../../services/pilotService";
import { NotFound } from "../error/NotFound";
import { useEffect } from "react";
import Protected from "../../routes/middlewares/Protected";
import { Col } from "../../components/grid/Col";
import { Button } from "@nextui-org/button";
import { Icon } from "../../components/Icons/Icon";
import { TableRoot } from "../../components/table/TableRoot";
import { compactGrid } from "../../theme/tableTheme";
import { Drawer } from "../../containers/Drawer";
import { PilotForm } from "../../components/forms/PilotForm";
import { initialPilot } from "./CreatePilotPage";
import { useDrawer } from "../../hooks/useDrawer";
import { PilotsResponseColumns } from "../../components/columns/PilotsResponseColumns";
import { QueryKeys } from "../../config/contants";



export const PilotPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = usePilots();
  const { pilot, add } = usePilotStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<PilotResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: [QueryKeys.Pilots],
    queryFn: () => getPilots(),
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Piloto
          </Button>
        </Col>
        <TableRoot
          columns={PilotsResponseColumns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de los pilotos"
          styles={compactGrid}
          title={"Pilotos"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Producto`}
            size="2xl"
          >
            <div className="p-5">
              <PilotForm
                initialForm={initialPilot}
                sendForm={create}
                text="Crear"
                reboot
              />
            </div>
          </Drawer>
        )}
        {render && (
          <Drawer
            isOpen={openUpdate}
            setIsOpen={() => {
              setOpenUpdate();
              add(null);
            }}
            title={`Editar Cliente`}
            size="2xl"
          >
            <div className="p-5">
              <PilotForm initialForm={pilot!} sendForm={update} text="Editar" />
            </div>
          </Drawer>
        )}
      </div>
    </Protected>
  );
};
