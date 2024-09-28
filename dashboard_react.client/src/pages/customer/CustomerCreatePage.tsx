import { CustomerForm } from "../../components/forms/CustomerForm";
import { Col } from "../../components/grid/Col";
import { useCustomer } from "../../hooks/useCustomer";
import Protected from "../../routes/middlewares/Protected";

export const initialCustomer: CustomerRequest = {
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  firstPhone: "",
  secondPhone: "",
  shippingFee: "0.00",
  socialNetworks: "",
  state: 1,
};

export const CustomerCreatePage = () => {
  const { create } = useCustomer();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
        <Col md={8}>
          <CustomerForm
            initialForm={initialCustomer}
            sendForm={create}
            text="Crear"
            reboot
          />
        </Col>
      </div>
    </Protected>
  );
};
