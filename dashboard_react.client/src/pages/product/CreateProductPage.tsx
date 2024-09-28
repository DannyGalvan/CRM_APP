import { Suspense } from "react";
import { ProductForm } from "../../components/forms/ProductForm";
import { Col } from "../../components/grid/Col";
import { useProducts } from "../../hooks/useProducts";
import Protected from "../../routes/middlewares/Protected";
import { ProductRequest } from "../../types/ProductRequest";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";

export const initialProduct: ProductRequest = {
  name: "",
  salePrice: 0,
  description: "",
  cost: 0,
  familyId: "",
  stock: 0,
};

export const CreateProductPage = () => {
  const { create } = useProducts();

  return (
   <Protected>
     <div className="page-view flex flex-col flex-wrap items-center justify-center">
      <Col md={8}>
        <ProductForm
          initialForm={initialProduct}
          sendForm={create}
          text="Crear"
          reboot
        />
      </Col>
    </div>
    <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
   </Protected>
  );
};
