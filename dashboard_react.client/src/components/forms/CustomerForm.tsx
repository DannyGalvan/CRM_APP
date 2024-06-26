import { Button, Input } from "@nextui-org/react";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialCustomer } from "../../pages/customer/CustomerCreatePage";
import { useCustomerStore } from "../../store/useCustomerStore";
import { ApiResponse } from "../../types/ApiResponse";
import { CustomerResponse } from "../../types/CustomerResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { customerShema } from "../../util/validations/customerValidations";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { Response } from "../messages/Response";

interface CustomerFormProps {
  initialForm: CustomerRequest | CustomerResponse;
  text: string;
  sendForm: (
    customer: CustomerRequest,
  ) => Promise<ApiResponse<CustomerResponse | ValidationFailure[]>>;
  reboot?: boolean;
}

const validateCustomer = (customer: CustomerRequest) => {
  let errors: ErrorObject = {};

  const parce = customerShema.safeParse(customer);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const CustomerForm = ({
  initialForm,
  text,
  sendForm,
  reboot,
}: CustomerFormProps) => {
  const {customer} = useCustomerStore();
  const {
    form,
    errors,
    handleChange,
    handleSubmit,
    loading,
    success,
    message,
  } = useForm<CustomerRequest, CustomerResponse>(
    initialForm ?? initialCustomer,
    validateCustomer,
    sendForm,
    reboot,
  );

  return (
    <Col md={12}>
      <h1 className="text-center text-2xl font-bold">{text} Cliente</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                label="Primer Nombre"
                isRequired
                errorMessage={errors?.firstName}
                variant="underlined"
                isInvalid={!!errors?.firstName}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="secondName"
                value={form.secondName}
                onChange={handleChange}
                label="Segundo Nombre"
                errorMessage={errors?.secondName}
                variant="underlined"
                isInvalid={!!errors?.secondName}
                isRequired
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="firstLastName"
                value={form.firstLastName}
                onChange={handleChange}
                label="Primer Apellido"
                errorMessage={errors?.firstLastName}
                variant="underlined"
                isInvalid={!!errors?.firstLastName}
                isRequired
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="secondLastName"
                value={form.secondLastName}
                onChange={handleChange}
                label="Segundo Apellido"
                errorMessage={errors?.secondLastName}
                variant="underlined"
                isInvalid={!!errors?.secondLastName}
                isRequired
              />
            </Col>
          </Row>
          <Input
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
          <CatalogueSearch
            querykey="Departments"
            entity="Departamento"
            errorMessage={errors?.departmentId}
            setFormValue={handleChange}
            name="departmentId"
            defaultValue={customer?.department?.name}
          />
          <CatalogueSearch
            querykey="Municipalities"
            entity="Municipio"
            errorMessage={errors?.municipalityId}
            setFormValue={handleChange}
            name="municipalityId"
            defaultValue={customer?.municipality?.name}
          />
           <CatalogueSearch
            querykey="Zones"
            entity="Zona"
            errorMessage={errors?.zoneId}
            setFormValue={handleChange}
            name="zoneId"
            defaultValue={customer?.zone?.name}
          />          
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="firstPhone"
                value={form.firstPhone}
                onChange={handleChange}
                label="Primer Teléfono"
                errorMessage={errors?.firstPhone}
                variant="underlined"
                isInvalid={!!errors?.firstPhone}
                isRequired
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="secondPhone"
                value={form.secondPhone}
                onChange={handleChange}
                label="Segundo Teléfono"
                errorMessage={errors?.secondPhone}
                variant="underlined"
                isInvalid={!!errors?.secondPhone}
                isRequired
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="colony_Condominium"
                value={form.colony_Condominium}
                onChange={handleChange}
                label="Colonia/Condominio"
                errorMessage={errors?.colony_Condominium}
                variant="underlined"
                isInvalid={!!errors?.colony_Condominium}
                isRequired
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="socialNetworks"
                value={form.socialNetworks}
                onChange={handleChange}
                label="Redes Sociales"
                errorMessage={errors?.socialNetworks}
                variant="underlined"
                isInvalid={!!errors?.socialNetworks}
              />
            </Col>
          </Row>
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
            {text} Cliente
          </Button>
        </form>
      </div>
    </Col>
  );
};
