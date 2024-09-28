import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TableColumn } from "react-data-table-component";

import { Icon } from "../../components/Icons/Icon";
import { CatalogueForm } from "../../components/forms/CatalogueForm";
import { Col } from "../../components/grid/Col";
import { CatalogueActionMenu } from "../../components/menu/CatalogueActionMenu";
import { CollectionSelect } from "../../components/select/CollectionSelect";
import { TableRoot } from "../../components/table/TableRoot";
import { DEFAULT_CATALOGUE, QueryKeys } from "../../config/contants";
import { Drawer } from "../../containers/Drawer";
import { useCatalogues } from "../../hooks/useCatalogues";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getAllCatalogues } from "../../services/catalogueService";
import { useCatalogueStore } from "../../store/useCatalogueStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { CatalogueResponse } from "../../types/CatalogueResponse";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { useDrawer } from "../../hooks/useDrawer";

import { initialCatalogue } from "./CreateCataloguePage";

const columns: TableColumn<any>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
  },
  {
    id: "name",
    name: "Nombre",
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
    id: "state",
    name: "Estado",
    selector: (data) => (data.state ? "Activo" : "Inactivo"),
    sortable: true,
    maxWidth: "100px",
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
    omit: false,
  },
  {
    id: "createdBy",
    name: "Creado por",
    selector: (data) => data.createdBy,
    sortable: true,
    maxWidth: "155px",
    omit: true,
  },
  {
    id: "updatedBy",
    name: "Actualizado por",
    selector: (data) => data.updatedBy,
    sortable: true,
    maxWidth: "155px",
    omit: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <CatalogueActionMenu data={data} useStore={useCatalogueStore} />;
    },
    wrap: true,
  },
];

export const CataloguePage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { catalogue, add } = useCatalogueStore();
  const {
    selectedCatalogue,
    collectionError,
    collectionFetching,
    collectionLoading,
    collections,
    handleSelect,
    createCatalog,
    updateCatalog,
  } = useCatalogues();

  const { data, error, isLoading, isFetching } = useQuery<
    ApiResponse<CatalogueResponse[]>,
    ApiError | undefined
  >({
    queryKey: [QueryKeys.Catalogues, selectedCatalogue.selected],
    queryFn: () => getAllCatalogues(selectedCatalogue.selected),
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  if (collectionError) {
    return (
      <NotFound
        Message={collectionError.message}
        Number={collectionError.statusCode}
      />
    );
  }

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <div>
          <CollectionSelect
            collections={collections}
            handleSelect={handleSelect}
            isLoading={collectionFetching || collectionLoading}
          />
        </div>
        <Col className="flex justify-end mt-5">
          <Button
            color={"secondary"}
            isDisabled={selectedCatalogue.name == DEFAULT_CATALOGUE}
            onClick={setOpenCreate}
          >
            <Icon name={"bi bi-journal-plus"} /> Crear {selectedCatalogue.name}
          </Button>
        </Col>
        <TableRoot
          columns={columns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          styles={compactGrid}
          text="de los catalogos"
          title={selectedCatalogue.name!}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            size="md"
            title={`Crear ${selectedCatalogue.name}`}
          >
            <div className="p-5">
              <CatalogueForm
                reboot
                collectionError={collectionError}
                initialForm={initialCatalogue}
                selectedCatalogue={selectedCatalogue}
                sendForm={createCatalog}
                text="Crear"
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
            size="md"
            title={`Editar ${selectedCatalogue.name}`}
          >
            <div className="p-5">
              <CatalogueForm
                collectionError={collectionError}
                initialForm={catalogue!}
                selectedCatalogue={selectedCatalogue}
                sendForm={updateCatalog}
                text="Editar"
              />
            </div>
          </Drawer>
        )}
      </div>
    </Protected>
  );
};
