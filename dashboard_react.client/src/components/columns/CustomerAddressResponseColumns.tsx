import { CustomerAddressResponse } from "../../types/CustomerAddressResponse";
import { CatalogueActionMenu } from "../menu/CatalogueActionMenu";
import { useCustomerAddressStore } from "../../store/useCustomerAddressStore";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const CustomerAddressReponseColumns: TableColumnWithFilters<CustomerAddressResponse>[] =
  [
    {
      id: "id",
      name: "Id",
      selector: (data) => data?.id ?? "",
      sortable: true,
      maxWidth: "150px",
      omit: true,
    },
    {
      id: "customer",
      name: "Cliente",
      selector: (data) => data?.customer?.fullName,
      omit: false,
      maxWidth: "250px",
      sortable: true,
      hasFilter: true,
      filterField: (value) => (value ? `Customer.FullName:like:${value}` : ""),
    },
    {
      id: "department",
      name: "Departamento",
      selector: (data) => data?.department?.name,
      sortable: true,
      maxWidth: "155px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Department.Name:like:${value}` : ""),
    },
    {
      id: "municipality",
      name: "Municipio",
      selector: (data) => data?.municipality?.name,
      sortable: true,
      maxWidth: "155px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Municipality.Name:like:${value}` : ""),
    },
    {
      id: "zone",
      name: "Zona",
      selector: (data) => data?.zone?.name,
      sortable: true,
      maxWidth: "125px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Zone.Name:like:${value}` : ""),
    },
    {
      id: "colony_condominium",
      name: "Colonia/Condominio",
      selector: (data) => data.colonyCondominium,
      sortable: true,
      maxWidth: "160px",
      wrap: true,
      omit: true,
      hasFilter: true,
      filterField: (value) => (value ? `ColonyCondominium:like:${value}` : ""),
    },
    {
      id: "address",
      name: "Direccion",
      selector: (data) => data.address,
      sortable: true,
      wrap: true,
      maxWidth: "350px",
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Address:like:${value}` : ""),
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
        return (
          <CatalogueActionMenu data={data} useStore={useCustomerAddressStore} />
        );
      },
      wrap: true,
    },
  ];
