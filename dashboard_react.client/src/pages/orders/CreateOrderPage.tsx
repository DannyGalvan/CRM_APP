import Protected from "../../routes/middlewares/Protected";
import { OrderRequest } from "../../types/OrderRequest";

export const initialOrder : OrderRequest = {
  customerId: "",
  paymentId: "",
  orderStateId: "",
  orderDetails: [],
}

export const CreateOrderPage = () => {
  return (
    <Protected>
      <div className="page-view container flex flex-col flex-wrap items-center justify-center">
        <h1 className="text-center text-2xl font-bold">Crear Orden</h1>
      </div>
    </Protected>
  );
};
