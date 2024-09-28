import Protected from "../../routes/middlewares/Protected";
import { compactGrid } from "../../theme/tableTheme";
import { getRoutes } from "../../services/routeService";
import { RouteResponse } from "../../types/RouteResponse";
import { Col } from "../../components/grid/Col";
import { Button } from "@nextui-org/button";
import { Icon } from "../../components/Icons/Icon";
import { Drawer } from "../../containers/Drawer";
import { RouteForm } from "../../components/forms/RouteForm";
import { useRoutes } from "../../hooks/useRoutes";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useEffect } from "react";
import { initialRoute } from "./CreateRoutePage";
import { useRouteStore } from "../../store/useRouteStore";
import { useDrawer } from "../../hooks/useDrawer";
import { RouteResponseColumns } from "../../components/columns/RouteResponseColumns";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";

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
          hasFilters={true}
          text="de las rutas"
          styles={compactGrid}
          title={"Rutas"}
          width={false}
          filters={routeFilters}
          setFilters={setRouteFilters}
          queryFn={getRoutes}
          queryKey={QueryKeys.Routes}
          hasRangeOfDates={true}
          fieldRangeOfDates="CreatedAt"          
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Ruta`}
            size="2xl"
            id="create"
          >
            <div className="p-5">
              <RouteForm
                initialForm={initialRoute}
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
            title={`Editar Ruta`}
            size="2xl"
            id="update"
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
