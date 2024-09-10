import { Response } from "../messages/Response";
import { CustomerAddressResponse } from "../../types/CustomerAddressResponse";
import { ApiResponse } from "../../types/ApiResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { Col } from "../grid/Col";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialCustomerAddress } from "../../pages/customer/address/AddressCreatePage";
import { Button } from "@nextui-org/button";
import { customerAddressShema } from "../../util/validations/customerAddressValidations";
import { handleOneLevelZodError } from "../../util/converted";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { useCustomerAddressStore } from "../../store/useCustomerAddressStore";
import { getCustomers } from "../../services/customerService";
import { Input, Textarea } from "@nextui-org/input";

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
      <h1 className="text-center text-2xl font-bold">
        {text} Dirección Cliente
      </h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <CatalogueSearch
            querykey="Customers"
            entity="Clientes"
            errorMessage={errors?.customerId}
            setFormValue={handleChange}
            name="customerId"
            keyName="FullName"
            queryFn={getCustomers}
            defaultValue={customerAddress?.customer?.fullName}
          />
          <CatalogueSearch
            querykey="Departments"
            entity="Departamento"
            errorMessage={errors?.departmentId}
            setFormValue={handleChange}
            name="departmentId"
            defaultValue={customerAddress?.department?.name}
          />
          <CatalogueSearch
            querykey="Municipalities"
            entity="Municipio"
            errorMessage={errors?.municipalityId}
            setFormValue={handleChange}
            name="municipalityId"
            defaultValue={customerAddress?.municipality?.name}
          />
          <CatalogueSearch
            querykey="Zones"
            entity="Zona"
            errorMessage={errors?.zoneId}
            setFormValue={handleChange}
            name="zoneId"
            defaultValue={customerAddress?.zone?.name}
          />
          <Input
            type="text"
            name="colonyCondominium"
            value={form.colonyCondominium}
            onChange={handleChange}
            label="Colonia/Condominio"
            errorMessage={errors?.colonyCondominium}
            variant="underlined"
            isInvalid={!!errors?.colonyCondominium}
            isRequired
          />
          <Textarea
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            label="Dirección"
            errorMessage={errors?.address}
            variant="underlined"
            className="px-2"
            isInvalid={!!errors?.address}
            isRequired
          />
          <Button
            isLoading={loading}
            type="submit"
            radius="md"
            size="lg"
            color="primary"
            fullWidth
            variant="shadow"
            className="mt-4 py-4 font-bold"
          >
            {text} Direccion Cliente
          </Button>
        </form>
      </div>
    </Col>
  );
};
