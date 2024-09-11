import { TableColumn } from "react-data-table-component";
import { RouteActionMenu } from "../menu/RouteActionMenu";


export const RouteResponseColumns: TableColumn<any>[] = [
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