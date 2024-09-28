import { usePilots } from "../../hooks/usePilots";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { usePilotStore } from "../../store/usePilotStore";
import { PilotResponse } from "../../types/PilotResponse";
import { getPilots } from "../../services/pilotService";
import { useEffect } from "react";
import Protected from "../../routes/middlewares/Protected";
import { Col } from "../../components/grid/Col";
import { Button } from "@nextui-org/button";
import { Icon } from "../../components/Icons/Icon";
import { compactGrid } from "../../theme/tableTheme";
import { Drawer } from "../../containers/Drawer";
import { PilotForm } from "../../components/forms/PilotForm";
import { initialPilot } from "./CreatePilotPage";
import { useDrawer } from "../../hooks/useDrawer";
import { PilotsResponseColumns } from "../../components/columns/PilotsResponseColumns";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";

export const PilotPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = usePilots();
  const { pilot, add, filterPilot, setFilterPilot } = usePilotStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Piloto
          </Button>
        </Col>
        <TableServer<PilotResponse>
          columns={PilotsResponseColumns}
          hasFilters={true}
          text="de los pilotos"
          styles={compactGrid}
          title={"Pilotos"}
          width={false}
          filters={filterPilot}
          setFilters={setFilterPilot}
          queryFn={getPilots}
          queryKey={QueryKeys.Pilots}
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
