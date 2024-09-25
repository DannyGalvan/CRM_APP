import { useQuery } from "@tanstack/react-query";
import { TableColumn } from "react-data-table-component";
import { TableRoot } from "../../components/table/TableRoot";
import Protected from "../../routes/middlewares/Protected";
import { getCollections } from "../../services/collectionService";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { CollectionResponse } from "../../types/CollectionResponse";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { QueryKeys } from "../../config/contants";

const columns: TableColumn<any>[] = [
  {
    id: "name",
    name: "Tabla",
    selector: (data) => data.name,
    sortable: true,
    maxWidth: "150px",
  },
  {
    id: "description",
    name: "Descripcion",
    selector: (data) => data.description,
    sortable: true,
    wrap: true,
  },
  {
    id: "nameView",
    name: "Nombre",
    selector: (data) => data.nameView,
    sortable: true,
    maxWidth: "150px",
  },
  {
    id: "isVisible",
    name: "Visible",
    selector: (data) => (data.isVisible ? "Si" : "No"),
    sortable: true,
    maxWidth: "100px",
  },
  {
    id: "isReadOnly",
    name: "Lectura",
    selector: (data) => (data.isReadOnly ? "Si" : "No"),
    sortable: true,
    maxWidth: "100px",
  },
  {
    id: "isDeleted",
    name: "Eliminado",
    selector: (data) => (data.isDeleted ? "Si" : "No"),
    sortable: true,
    maxWidth: "100px",
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "155px",
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt,
    sortable: true,
    maxWidth: "155px",
  },
];

export const CollectionPage = () => {
  const { data, error, isLoading, isFetching } = useQuery<
    ApiResponse<CollectionResponse[]>,
    ApiError
  >({
    queryKey: [QueryKeys.Collections],
    queryFn: getCollections,
  });

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <TableRoot
          columns={columns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de las listas"
          styles={compactGrid}
          title="Tablas"
          width={false}
        />
      </div>
    </Protected>
  );
};
