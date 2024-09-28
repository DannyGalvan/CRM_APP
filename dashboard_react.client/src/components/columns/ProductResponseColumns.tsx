import { ProductResponse } from "../../types/ProductResponse";
import { CatalogueActionMenu } from "../menu/CatalogueActionMenu";
import { useProductStore } from "../../store/useProductStore";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const ProductResponseColumns: TableColumnWithFilters<ProductResponse>[] =
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
      id: "name",
      name: "Nombre",
      selector: (data) => data.name,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Name:like:${value}` : ""),
    },
    {
      id: "description",
      name: "Descripcion",
      selector: (data) => data.description,
      sortable: true,
      wrap: true,
      omit: true,
      hasFilter: true,
      filterField: (value) => (value ? `Description:like:${value}` : ""),
    },
    {
      id: "family",
      name: "Familia",
      selector: (data) => data.family?.name,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Family.Name:like:${value}` : ""),
    },
    {
      id: "cost",
      name: "Costo",
      selector: (data) => data.cost,
      sortable: true,
      wrap: true,
      omit: false,
      format: (data) => `Q. ${data.cost?.toFixed(2)}`,
    },
    {
      id: "salePrice",
      name: "Precio de Venta",
      selector: (data) => data.salePrice,
      sortable: true,
      wrap: true,
      omit: false,
      format: (data) => `Q. ${data.salePrice?.toFixed(2)}`,
    },
    {
      id: "stock",
      name: "Stock",
      selector: (data) => data.stock,
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
        return <CatalogueActionMenu data={data} useStore={useProductStore} />;
      },
      wrap: true,
    },
  ];
