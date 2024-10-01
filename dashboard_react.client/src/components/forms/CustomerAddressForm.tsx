import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";

import { QueryKeys } from "../../config/contants";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { ModalType } from "../../hooks/useModalStrategies";
import { initialCustomerAddress } from "../../pages/customer/address/AddressCreatePage";
import { getCustomers } from "../../services/customerService";
import { useCustomerAddressStore } from "../../store/useCustomerAddressStore";
import { ApiResponse } from "../../types/ApiResponse";
import { CustomerAddressResponse } from "../../types/CustomerAddressResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { customerAddressShema } from "../../util/validations/customerAddressValidations";
import { Col } from "../grid/Col";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { Response } from "../messages/Response";

interface CustomerAddressFormProps {
  initialForm: CustomerAddressRequest | CustomerAddressResponse;
  text: string;
  sendForm: (
    customer: CustomerAddressRequest,
  ) => Promise<ApiResponse<CustomerAddressResponse | ValidationFailure[]>>;
  reboot?: boolean;
}

const validateCustomer = (customer: CustomerAddressRequest) => {
  let errors: ErrorObject = {};

  const parce = customerAddressShema.safeParse(customer);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const CustomerAddressForm = ({
  text,
  initialForm,
  sendForm,
  reboot,
}: CustomerAddressFormProps) => {
  const { customerAddress } = useCustomerAddressStore();
  const {
    form,
    errors,
    handleChange,
    handleSubmit,
    loading,
    success,
    message,
  } = useForm<CustomerAddressRequest, CustomerAddressResponse>(
    initialForm ?? initialCustomerAddress,
    validateCustomer,
    sendForm,
    reboot,
  );

  return (
    <Col md={12}>
      <h1 className="text-2xl font-bold text-center">
        {text} Dirección Cliente
      </h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <CatalogueSearch
            defaultValue={customerAddress?.customer?.fullName}
            entity="Clientes"
            errorMessage={errors?.customerId}
            keyName="FullName"
            name="customerId"
            queryFn={getCustomers}
            querykey={QueryKeys.Customers as ModalType}
            setFormValue={handleChange}
          />
          <CatalogueSearch
            defaultValue={customerAddress?.department?.name}
            entity="Departamento"
            errorMessage={errors?.departmentId}
            name="departmentId"
            querykey={QueryKeys.Departments as ModalType}
            setFormValue={handleChange}
          />
          <CatalogueSearch
            defaultValue={customerAddress?.municipality?.name}
            entity="Municipio"
            errorMessage={errors?.municipalityId}
            name="municipalityId"
            querykey={QueryKeys.Municipalities as ModalType}
            setFormValue={handleChange}
          />
          <CatalogueSearch
            defaultValue={customerAddress?.zone?.name}
            entity="Zona"
            errorMessage={errors?.zoneId}
            name="zoneId"
            querykey={QueryKeys.Zones as ModalType}
            setFormValue={handleChange}
          />
          <Input
            isRequired
            errorMessage={errors?.colonyCondominium}
            isInvalid={!!errors?.colonyCondominium}
            label="Colonia/Condominio"
            name="colonyCondominium"
            type="text"
            value={form.colonyCondominium}
            variant="underlined"
            onChange={handleChange}
          />
          <Textarea
            isRequired
            className="px-2"
            errorMessage={errors?.address}
            isInvalid={!!errors?.address}
            label="Dirección"
            name="address"
            type="text"
            value={form.address}
            variant="underlined"
            onChange={handleChange}
          />
          <Button
            fullWidth
            className="py-4 mt-4 font-bold"
            color="primary"
            isLoading={loading}
            radius="md"
            size="lg"
            type="submit"
            variant="shadow"
          >
            {text} Direccion Cliente
          </Button>
        </form>
      </div>
    </Col>
  );
};
