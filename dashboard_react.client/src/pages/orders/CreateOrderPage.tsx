import { OrderForm } from "../../components/forms/OrderForm";
import { Col } from "../../components/grid/Col";
import { useOrder } from "../../hooks/useOrder";
import Protected from "../../routes/middlewares/Protected";
import { OrderRequest } from "../../types/OrderRequest";
import { today } from "../../util/converted";

export const initialOrder: OrderRequest = {
  customerId: "",
  paymentTypeId: "",
  deliveryDate: today(),
  orderStateId: "667a0b4ea82250a2c13748c2",
  orderDetails: [],
};

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
    </Protected>
  );
};
