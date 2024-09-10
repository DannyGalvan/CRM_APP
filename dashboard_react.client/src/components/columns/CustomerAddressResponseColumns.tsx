import { TableColumn } from "react-data-table-component";
import { CustomerAddressResponse } from "../../types/CustomerAddressResponse";
import { CatalogueActionMenu } from "../menu/CatalogueActionMenu";
import { useCustomerAddressStore } from "../../store/useCustomerAddressStore";

export const CustomerAddressReponseColumns: TableColumn<CustomerAddressResponse>[] =
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
      sortable: true,
    },
    {
      id: "department",
      name: "Departamento",
      selector: (data) => data?.department?.name,
      sortable: true,
      maxWidth: "155px",
      omit: false,
    },
    {
      id: "municipality",
      name: "Municipio",
      selector: (data) => data?.municipality?.name,
      sortable: true,
      maxWidth: "155px",
      omit: false,
    },
    {
      id: "zone",
      name: "Zona",
      selector: (data) => data?.zone?.name,
      sortable: true,
      maxWidth: "125px",
      omit: false,
    },
    {
      id: "colony_condominium",
      name: "Colonia/Condominio",
      selector: (data) => data.colonyCondominium,
      sortable: true,
      maxWidth: "160px",
      omit: true,
    },
    {
      id: "address",
      name: "Direccion",
      selector: (data) => data.address,
      sortable: true,
      maxWidth: "160px",
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
        return (
          <CatalogueActionMenu data={data} useStore={useCustomerAddressStore} />
        );
      },
      wrap: true,
    },
  ];
