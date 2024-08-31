import { lazy, Suspense } from "react";
import { OrderForm } from "../../components/forms/OrderForm";
import { Col } from "../../components/grid/Col";
import { useOrder } from "../../hooks/useOrder";
import Protected from "../../routes/middlewares/Protected";
import { OrderRequest } from "../../types/OrderRequest";
import { today } from "../../util/converted";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";

export const initialOrder: OrderRequest = {
  customerId: "",
  paymentTypeId: "",
  deliveryDate: today(),
  orderStateId: "667a0b4ea82250a2c13748c2",
  orderDetails: [],
};

const ModalCreateItem = lazy(() =>
  import("../../components/modals/ModalCreateItem").then((module) => ({
    default: module.ModalCreateItem,
  })),
);

export const CreateOrderPage = () => {
  const { create } = useOrder();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
        <Col md={12}>
          <OrderForm
            initialForm={initialOrder}
            sendForm={create}
            action="Crear"
            reboot
          />
        </Col>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItem />
      </Suspense>
    </Protected>
  );
};
