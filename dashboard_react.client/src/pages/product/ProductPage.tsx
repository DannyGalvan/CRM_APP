import { Button } from "@nextui-org/button";
import { Suspense, useEffect } from "react";
import { Icon } from "../../components/Icons/Icon";
import { ProductForm } from "../../components/forms/ProductForm";
import { Col } from "../../components/grid/Col";
import { Drawer } from "../../containers/Drawer";
import { useProducts } from "../../hooks/useProducts";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getProducts } from "../../services/productService";
import { useProductStore } from "../../store/useProductStore";
import { compactGrid } from "../../theme/tableTheme";
import { initialProduct } from "./CreateProductPage";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useDrawer } from "../../hooks/useDrawer";
import { QueryKeys } from "../../config/contants";
import { ProductResponseColumns } from "../../components/columns/ProductResponseColumns";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";
import { TableServer } from "../../components/table/TableServer";

export const ProductPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useProducts();
  const { product, add, productFilters, setProductFilters } = useProductStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Producto
          </Button>
        </Col>
        <TableServer
          columns={ProductResponseColumns}
          filters={productFilters}
          queryFn={getProducts}
          queryKey={QueryKeys.Products}
          setFilters={setProductFilters}
          title="Productos"
          text="producto"
          hasFilters
          styles={compactGrid}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
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
              setOpenUpdate();
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
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
