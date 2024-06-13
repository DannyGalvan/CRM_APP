import { CustomerForm } from "../../components/forms/CustomerForm";
import { Col } from "../../components/grid/Col";
import { useCustomer } from "../../hooks/useCustomer";

export const initialCustomer: CustomerRequest = {
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  firstPhone: "",
  secondPhone: "",
  address: "",
  zoneId: "",
  municipalityId: "",
  departmentId: "",
  colony_Condominium: "",
  socialNetworks: "",
  state: 1,
};

export const CustomerCreatePage = () => {
  const { create } = useCustomer();

  return (
    <div className="page-view container flex flex-col flex-wrap items-center justify-center">
      <Col md={8}>
        <CustomerForm
          initialForm={initialCustomer}
          sendForm={create}
          text="Crear"
          reboot
        />
      </Col>
    </div>
  );
};
