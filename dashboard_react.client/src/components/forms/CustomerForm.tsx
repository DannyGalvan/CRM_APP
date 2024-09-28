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
              />
            </Col>
          </Row>
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
              />
            </Col>
          </Row>
          <Input
            type="number"
            name="shippingFee"
            step={0.01}
            min={0}
            value={form.shippingFee}
            onChange={handleChange}
            label="Costo de Envío Q"
            errorMessage={errors?.shippingFee}
            variant="underlined"
            isInvalid={!!errors?.shippingFee}
          />
          <Textarea
            type="text"
            name="socialNetworks"
            value={form.socialNetworks}
            onChange={handleChange}
            label="Redes Sociales"
            errorMessage={errors?.socialNetworks}
            variant="underlined"
            isInvalid={!!errors?.socialNetworks}
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
            {text} Cliente
          </Button>
        </form>
      </div>
    </Col>
  );
};
