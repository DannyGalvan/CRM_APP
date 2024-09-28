import { RouteActionMenu } from "../menu/RouteActionMenu";
import { RouteResponse } from "../../types/RouteResponse";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const RouteResponseColumns: TableColumnWithFilters<RouteResponse>[] = [
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
    hasFilter: true,
    filterField: (value) => (value ? `Name:like:${value}` : ""),
  },
  {
    id: "observations",
    name: "Observaciones",
    selector: (data) => data.observations,
    sortable: true,
    wrap: true,
    omit: false,
    hasFilter: true,
    filterField: (value) => (value ? `Observations:like:${value}` : ""),
  },
  {
    id: "state",
    name: "Estado",
    selector: (data) => (data.state == 1 ? "Creado" : "Eliminado"),
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt ?? "",
    sortable: true,
    maxWidth: "160px",
    omit: false,
    hasFilter: true,
    filterField: (value) => (value ? `CreatedAt:gt:${value}T00` : ""),
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt ?? "",
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
