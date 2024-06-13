import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { Icon } from "../../components/Icons/Icon";
import { ProductForm } from "../../components/forms/ProductForm";
import { Col } from "../../components/grid/Col";
import { CatalogueActionMenu } from "../../components/menu/CatalogueActionMenu";
import { TableRoot } from "../../components/table/TableRoot";
import { Drawer } from "../../containers/Drawer";
import { DrawerProvider } from "../../context/DrawerContext";
import { useProducts } from "../../hooks/useProducts";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useToggle } from "../../hooks/useToggle";
import { getProducts } from "../../services/productService";
import { useProductStore } from "../../store/useProductStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { ProductResponse } from "../../types/ProductResponse";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { initialProduct } from "./CreateProductPage";

const columns: TableColumn<any>[] = [
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
  },
  {
    id: "description",
    name: "Descripcion",
    selector: (data) => data.description,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "family",
    name: "Familia",
    selector: (data) => data.family?.name,
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "cost",
    name: "Costo",
    selector: (data) => data.cost.toFixed(2),
    sortable: true,
    wrap: true,
    omit: false,
  },
  {
    id: "salePrice",
    name: "Precio de Venta",
    selector: (data) => data.salePrice.toFixed(2),
    sortable: true,
    wrap: true,
    omit: false,
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
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
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
      return <CatalogueActionMenu data={data} useStore={useProductStore} />;
    },
    wrap: true,
  },
];

export const ProductPage = () => {
  const { open, toggle } = useToggle();
  const { open: openUpdate, toggle: toggleUpdate } = useToggle();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useProducts();
  const { product, add } = useProductStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<ProductResponse[]>,
    ApiError | undefined
  >({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  useEffect(() => {
    reRender();
  }, []);

  return (
    <DrawerProvider setOpenUpdate={toggleUpdate}>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={toggle}>
            <Icon name={"bi bi-bag-plus"} /> Crear Producto
          </Button>
        </Col>
        <TableRoot
          columns={columns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de los productos"
          styles={compactGrid}
          title={"Productos"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={open}
            setIsOpen={toggle}
            title={`Crear Producto`}
            size="2xl"
          >
            <div className="p-5">
              <ProductForm
                initialForm={initialProduct}
                sendForm={create}
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
              toggleUpdate();
              add(null);
            }}
            title={`Editar Cliente`}
            size="2xl"
          >
            <div className="p-5">
              <ProductForm
                initialForm={product!}
                sendForm={update}
                text="Editar"
              />
            </div>
          </Drawer>
        )}
      </div>
    </DrawerProvider>
  );
};
