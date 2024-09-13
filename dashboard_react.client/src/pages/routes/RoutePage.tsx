import { useQuery } from "@tanstack/react-query";
import { TableRoot } from "../../components/table/TableRoot";
import Protected from "../../routes/middlewares/Protected";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { ApiError } from "../../util/errors";
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
import { NotFound } from "../error/NotFound";
import { RouteResponseColumns } from "../../components/columns/RouteResponseColumns";

export const RoutePage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useRoutes();
  const { route, add } = useRouteStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<RouteResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: ["routes"],
    queryFn: () => getRoutes("State:eq:1"),
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
            <Icon name={"bi bi-bag-plus"} /> Crear Ruta
          </Button>
        </Col>
        <TableRoot
          columns={RouteResponseColumns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de las rutas"
          styles={compactGrid}
          title={"Rutas"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Ruta`}
            size="2xl"
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
