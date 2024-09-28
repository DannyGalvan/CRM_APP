import { Suspense } from "react";

import { OrderForm } from "../../components/forms/OrderForm";
import { Col } from "../../components/grid/Col";
import { useOrder } from "../../hooks/useOrder";
import Protected from "../../routes/middlewares/Protected";
import { OrderRequest } from "../../types/OrderRequest";
import { today } from "../../util/converted";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { OrderStates } from "../../config/contants";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";

export const initialOrder: OrderRequest = {
  customerId: "",
  customerDirectionId: "",
  paymentTypeId: "",
  deliveryDate: today(),
  orderStateId: OrderStates.create,
  orderDetails: [],
};

export const CreateOrderPage = () => {
  const { create } = useOrder();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
        <Col md={12}>
          <OrderForm
            reboot
            action="Crear"
            initialForm={initialOrder}
            sendForm={create}
          />
        </Col>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
