import { Input } from "@nextui-org/input";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialPilot } from "../../pages/pilots/CreatePilotPage";
import { ApiResponse } from "../../types/ApiResponse";
import { PilotRequest } from "../../types/PilotRequest";
import { PilotResponse } from "../../types/PilotResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { pilotSchema } from "../../util/validations/pilotValidations";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";
import { Button } from "@nextui-org/button";
import { Row } from "../grid/Row";

interface PilotFormProps {
  initialForm: PilotRequest | PilotResponse;
  sendForm: (
    product: PilotRequest,
  ) => Promise<ApiResponse<PilotResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const pilotValidations = (pilot: PilotRequest) => {
  let errors: ErrorObject = {};

  const parce = pilotSchema.safeParse(pilot);

  if (!parce.success) {
    errors = handleOneLevelZodError(parce.error);
  }

  return errors;
};

export const PilotForm = ({
  initialForm,
  sendForm,
  text,
  reboot,
}: PilotFormProps) => {
  const {
    form,
    errors,
    handleSubmit,
    handleChange,
    loading,
    success,
    message,
  } = useForm<PilotRequest, PilotResponse>(
    initialForm ?? initialPilot,
    pilotValidations,
    sendForm,
    reboot,
  );
  
  return (
    <Col md={12}>
      <h1 className="text-center text-2xl font-bold">{text} Piloto</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                label="Nombre"
                isRequired
                errorMessage={errors?.name}
                variant="underlined"
                isInvalid={!!errors?.name}
                className="px-2"
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                label="Apellido"
                isRequired
                errorMessage={errors?.lastName}
                variant="underlined"
                isInvalid={!!errors?.lastName}
                className="px-2"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="license"
                value={form.license}
                onChange={handleChange}
                label="Licencia"
                errorMessage={errors?.license}
                variant="underlined"
                isInvalid={!!errors?.license}
                className="px-2"
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                label="Teléfono"
                isRequired
                errorMessage={errors?.phone}
                variant="underlined"
                isInvalid={!!errors?.phone}
                className="px-2"
              />
            </Col>
          </Row>
          <Input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Correo Electrónico"
            errorMessage={errors?.email}
            variant="underlined"
            isInvalid={!!errors?.email}
            className="px-2"
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
            {text} Piloto
          </Button>
        </form>
      </div>
    </Col>
  );
};
