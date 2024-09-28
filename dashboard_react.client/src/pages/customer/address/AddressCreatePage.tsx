import { Suspense } from "react";

import { Col } from "../../../components/grid/Col";
import Protected from "../../../routes/middlewares/Protected";
import { LoadingComponent } from "../../../components/spinner/LoadingComponent";
import { CustomerAddressForm } from "../../../components/forms/CustomerAddressForm";
import { useCustomerAddress } from "../../../hooks/useCustomerAddress";
import { ModalCreateItemAsync } from "../../../components/modals/ModalCreateItemAsync";

export const initialCustomerAddress: CustomerAddressRequest = {
  address: "",
  zoneId: "",
  municipalityId: "",
  departmentId: "",
  colonyCondominium: "",
};

export const AddressCreatePage = () => {
  const { create } = useCustomerAddress();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
        <Col md={8}>
          <CustomerAddressForm
            reboot
            initialForm={initialCustomerAddress}
            sendForm={create}
            text="Crear"
          />
        </Col>
      </div>
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
