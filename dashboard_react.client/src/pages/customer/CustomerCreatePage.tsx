import { CustomerForm } from "../../components/forms/CustomerForm";
import { Col } from "../../components/grid/Col";
import { useCustomer } from "../../hooks/useCustomer";
import Protected from "../../routes/middlewares/Protected";
import { CustomerRequest } from "../../types/CustomerRequest";

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
      <div className="flex flex-col flex-wrap justify-center items-center page-view">
        <Col md={8}>
          <CustomerForm
            reboot
            initialForm={initialCustomer}
            sendForm={create}
            text="Crear"
          />
        </Col>
      </div>
    </Protected>
  );
};
