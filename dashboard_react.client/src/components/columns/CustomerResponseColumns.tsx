import { CustomerResponse } from "../../types/CustomerResponse";
import { CatalogueActionMenu } from "../menu/CatalogueActionMenu";
import { useCustomerStore } from "../../store/useCustomerStore";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const CustomerResponseColumns: TableColumnWithFilters<CustomerResponse>[] =
  [
    {
      id: "id",
      name: "Id",
      selector: (data) => data.id,
      sortable: true,
      maxWidth: "150px",
      omit: true,
    },
    {
      id: "firstName",
      name: "Nombre",
      selector: (data) => data.firstName,
      sortable: true,
      maxWidth: "150px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `FirstName:like:${value}` : ""),
    },
    {
      id: "secondName",
      name: "Segundo Nombre",
      selector: (data) => data.secondName,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `SecondName:like:${value}` : ""),
    },
    {
      id: "firstLastName",
      name: "Apellido",
      selector: (data) => data.firstLastName,
      sortable: true,
      maxWidth: "130px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `FirstLastName:like:${value}` : ""),
    },
    {
      id: "secondLastName",
      name: "Segundo Apellido",
      selector: (data) => data.secondLastName,
      sortable: true,
      maxWidth: "160px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `SecondLastName:like:${value}` : ""),
    },
    {
      id: "phone",
      name: "Telefono",
      selector: (data) => data.firstPhone,
      sortable: true,
      maxWidth: "155px",
      omit: false,
    },
    {
      id: "secondPhone",
      name: "Telefono 2",
      selector: (data) => data.secondPhone,
      sortable: true,
      maxWidth: "155px",
      omit: false,
    },
    {
      id: "createdAt",
      name: "Creado",
      selector: (data) => data.createdAt ?? "",
      sortable: true,
      maxWidth: "160px",
      omit: true,
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
        return <CatalogueActionMenu data={data} useStore={useCustomerStore} />;
      },
      wrap: true,
    },
  ];
