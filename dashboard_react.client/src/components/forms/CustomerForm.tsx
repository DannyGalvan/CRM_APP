import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";

import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialCustomer } from "../../pages/customer/CustomerCreatePage";
import { ApiResponse } from "../../types/ApiResponse";
import { CustomerResponse } from "../../types/CustomerResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { customerShema } from "../../util/validations/customerValidations";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";
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
      <h1 className="text-2xl font-bold text-center">{text} Cliente</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Row>
            <Col md={6} sm={12}>
              <Input
                isRequired
                errorMessage={errors?.firstName}
                isInvalid={!!errors?.firstName}
                label="Primer Nombre"
                name="firstName"
                type="text"
                value={form.firstName}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                errorMessage={errors?.secondName}
                isInvalid={!!errors?.secondName}
                label="Segundo Nombre"
                name="secondName"
                type="text"
                value={form.secondName}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                isRequired
                errorMessage={errors?.firstLastName}
                isInvalid={!!errors?.firstLastName}
                label="Primer Apellido"
                name="firstLastName"
                type="text"
                value={form.firstLastName}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                errorMessage={errors?.secondLastName}
                isInvalid={!!errors?.secondLastName}
                label="Segundo Apellido"
                name="secondLastName"
                type="text"
                value={form.secondLastName}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                isRequired
                errorMessage={errors?.firstPhone}
                isInvalid={!!errors?.firstPhone}
                label="Primer Teléfono"
                name="firstPhone"
                type="text"
                value={form.firstPhone}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                errorMessage={errors?.secondPhone}
                isInvalid={!!errors?.secondPhone}
                label="Segundo Teléfono"
                name="secondPhone"
                type="text"
                value={form.secondPhone}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Input
            errorMessage={errors?.shippingFee}
            isInvalid={!!errors?.shippingFee}
            label="Costo de Envío Q"
            min={0}
            name="shippingFee"
            step={0.01}
            type="number"
            value={form.shippingFee}
            variant="underlined"
            onChange={handleChange}
          />
          <Textarea
            errorMessage={errors?.socialNetworks}
            isInvalid={!!errors?.socialNetworks}
            label="Redes Sociales"
            name="socialNetworks"
            type="text"
            value={form.socialNetworks}
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
            {text} Cliente
          </Button>
        </form>
      </div>
    </Col>
  );
};
