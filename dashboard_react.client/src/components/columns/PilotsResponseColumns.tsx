import { TableColumn } from "react-data-table-component";
import { usePilotStore } from "../../store/usePilotStore";
import { CatalogueActionMenu } from "../menu/CatalogueActionMenu";
import { PilotResponse } from "../../types/PilotResponse";

export const PilotsResponseColumns: TableColumn<PilotResponse>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data?.id ?? "",
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "name",
    name: "Nombre",
    selector: (data) => data.name,
    sortable: true,
    wrap: true,
    omit: true,
  },
  {
    id: "lastName",
    name: "Apellido",
    selector: (data) => data.lastName,
    sortable: true,
    wrap: true,
    omit: true,
  },
  {
    id: "fullName",
    name: "Nombre",
    selector: (data) => data.fullName,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "licence",
    name: "Licencia",
    selector: (data) => data.license,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "phone",
    name: "Teléfono",
    selector: (data) => data.phone,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "email",
    name: "Correo",
    selector: (data) => data.email,
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
    selector: (data) => data?.createdAt ?? "",
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data?.updatedAt ?? "",
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <CatalogueActionMenu data={data} useStore={usePilotStore} />;
    },
    wrap: true,
  },
];
