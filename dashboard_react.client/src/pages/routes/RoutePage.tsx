/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button } from "@nextui-org/button";
import { useEffect } from "react";

import { Icon } from "../../components/Icons/Icon";
import { RouteResponseColumns } from "../../components/columns/RouteResponseColumns";
import { RouteForm } from "../../components/forms/RouteForm";
import { Col } from "../../components/grid/Col";
import { TableServer } from "../../components/table/TableServer";
import { QueryKeys } from "../../config/contants";
import { Drawer } from "../../containers/Drawer";
import { useDrawer } from "../../hooks/useDrawer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useRoutes } from "../../hooks/useRoutes";
import Protected from "../../routes/middlewares/Protected";
import { downloadFile } from "../../services/reportService";
import { getRoutes } from "../../services/routeService";
import { useRangeOfDatesStore } from "../../store/useRangeOfDatesStore";
import { useRouteStore } from "../../store/useRouteStore";
import { compactGrid } from "../../theme/tableTheme";
import { RouteResponse } from "../../types/RouteResponse";

import { initialRoute } from "./CreateRoutePage";

export const RoutePage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useRoutes();
  const { route, add, routeFilters, setRouteFilters } = useRouteStore();
  const { getCalendarDateFilter, getCalendarDateTitle } =
    useRangeOfDatesStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="flex gap-2 justify-end mt-5">
          <Button
            color={"secondary"}
            onClick={() =>
              downloadFile(
                `/Route/Products?filters=${getCalendarDateFilter("CreatedAt")}&observations=${getCalendarDateTitle()}`,
              )
            }
          >
            <Icon name={"bi bi-bag-plus"} /> Reporte de Productos
          </Button>
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
