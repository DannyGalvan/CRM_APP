import { useQuery } from "@tanstack/react-query";
import { TableRoot } from "../../components/table/TableRoot";
import Protected from "../../routes/middlewares/Protected";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { getRoutes } from "../../services/routeService";
import { RouteResponse } from "../../types/RouteResponse";
import { TableColumn } from "react-data-table-component";
import { RouteActionMenu } from "../../components/menu/RouteActionMenu";
import { DrawerProvider } from "../../context/DrawerContext";
import { useToggle } from "../../hooks/useToggle";
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
import { RouteDtoRequest } from "../../types/RouteDto";

const columns: TableColumn<any>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "pilot",
    name: "Piloto",
    selector: (data) => data.pilot?.name,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "observations",
    name: "Observaciones",
    selector: (data) => data.observations,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "state",
    name: "Estado",
    selector: (data) => (data.state == 1 ? "Activo" : "Inactivo"),
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "160px",
    omit: false,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <RouteActionMenu data={data} />;
    },
    wrap: true,
  },
];

export const RoutePage = () => {
  const { open, toggle } = useToggle();
  const { open: openUpdate, toggle: toggleUpdate } = useToggle();
  const { reRender, render } = useRetraseRender();
  const { create } = useRoutes();
  const { route, add } = useRouteStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<RouteResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: ["routes"],
    queryFn: () => getRoutes(""),
  });

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <DrawerProvider setOpenUpdate={toggleUpdate}>
          <Col className="mt-5 flex justify-end">
            <Button color={"secondary"} onClick={toggle}>
              <Icon name={"bi bi-bag-plus"} /> Crear Ruta
            </Button>
          </Col>
          <TableRoot
            columns={columns}
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
              isOpen={open}
              setIsOpen={toggle}
              title={`Crear Producto`}
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
                toggleUpdate();
                add(null);
              }}
              title={`Editar Cliente`}
              size="2xl"
            >
              <div className="p-5">
                <RouteForm
                  initialForm={route!}
                  sendForm={(route:RouteDtoRequest)=>{

                  }}
                  text="Editar"
                />
              </div>
            </Drawer>
          )}
        </DrawerProvider>
      </div>
    </Protected>
  );
};
