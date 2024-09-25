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
import { initialCatalogue } from "./CreateCataloguePage";
import { useDrawer } from "../../hooks/useDrawer";

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
          <Col className="mt-5 flex justify-end">
            <Button
              color={"secondary"}
              onClick={setOpenCreate}
              isDisabled={selectedCatalogue.name == DEFAULT_CATALOGUE}
            >
              <Icon name={"bi bi-journal-plus"} /> Crear{" "}
              {selectedCatalogue.name}
            </Button>
          </Col>
          <TableRoot
            columns={columns}
            data={data?.data ?? []}
            hasFilters={true}
            pending={isLoading || isFetching}
            text="de los catalogos"
            styles={compactGrid}
            title={selectedCatalogue.name!}
            width={false}
          />
          {render && (
            <Drawer
              isOpen={openCreate}
              setIsOpen={setOpenCreate}
              title={`Crear ${selectedCatalogue.name}`}
              size="md"
            >
              <div className="p-5">
                <CatalogueForm
                  collectionError={collectionError}
                  selectedCatalogue={selectedCatalogue}
                  initialForm={initialCatalogue}
                  sendForm={createCatalog}
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
                setOpenUpdate();
                add(null);
              }}
              title={`Editar ${selectedCatalogue.name}`}
              size="md"
            >
              <div className="p-5">
                <CatalogueForm
                  collectionError={collectionError}
                  selectedCatalogue={selectedCatalogue}
                  initialForm={catalogue!}
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
