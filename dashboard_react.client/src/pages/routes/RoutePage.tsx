import { Button } from "@nextui-org/button";
import { useEffect } from "react";

import Protected from "../../routes/middlewares/Protected";
import { compactGrid } from "../../theme/tableTheme";
import { getRoutes } from "../../services/routeService";
import { RouteResponse } from "../../types/RouteResponse";
import { Col } from "../../components/grid/Col";
import { Icon } from "../../components/Icons/Icon";
import { Drawer } from "../../containers/Drawer";
import { RouteForm } from "../../components/forms/RouteForm";
import { useRoutes } from "../../hooks/useRoutes";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useRouteStore } from "../../store/useRouteStore";
import { useDrawer } from "../../hooks/useDrawer";
import { RouteResponseColumns } from "../../components/columns/RouteResponseColumns";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";

import { initialRoute } from "./CreateRoutePage";

export const RoutePage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useRoutes();
  const { route, add, routeFilters, setRouteFilters } = useRouteStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Ruta
          </Button>
        </Col>
        <TableServer<RouteResponse>
          columns={RouteResponseColumns}
          fieldRangeOfDates="CreatedAt"
          filters={routeFilters}
          hasFilters={true}
          hasRangeOfDates={true}
          queryFn={getRoutes}
          queryKey={QueryKeys.Routes}
          setFilters={setRouteFilters}
          styles={compactGrid}
          text="de las rutas"
          title={"Rutas"}
          width={false}
        />
        {render && (
          <Drawer
            id="create"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            size="2xl"
            title={`Crear Ruta`}
          >
            <div className="p-5">
              <RouteForm
                reboot
                initialForm={initialRoute}
                sendForm={create}
                text="Crear"
              />
            </div>
          </Drawer>
        )}
        {render && (
          <Drawer
            id="update"
            isOpen={openUpdate}
            setIsOpen={() => {
              setOpenUpdate();
              add(null);
            }}
            size="2xl"
            title={`Editar Ruta`}
          >
            <div className="p-5">
              <RouteForm initialForm={route!} sendForm={update} text="Editar" />
            </div>
          </Drawer>
        )}
      </div>
    </Protected>
  );
};
