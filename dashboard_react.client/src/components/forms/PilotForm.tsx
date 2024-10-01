import { Button } from "@nextui-org/button";
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
import { Row } from "../grid/Row";
import { Response } from "../messages/Response";

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
      <h1 className="text-2xl font-bold text-center">{text} Piloto</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
          <Row>
            <Col md={6} sm={12}>
              <Input
                isRequired
                className="px-2"
                errorMessage={errors?.name}
                isInvalid={!!errors?.name}
                label="Nombre"
                name="name"
                type="text"
                value={form.name}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                isRequired
                className="px-2"
                errorMessage={errors?.lastName}
                isInvalid={!!errors?.lastName}
                label="Apellido"
                name="lastName"
                type="text"
                value={form.lastName}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={12}>
              <Input
                className="px-2"
                errorMessage={errors?.license}
                isInvalid={!!errors?.license}
                label="Licencia"
                name="license"
                type="text"
                value={form.license}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={6} sm={12}>
              <Input
                isRequired
                className="px-2"
                errorMessage={errors?.phone}
                isInvalid={!!errors?.phone}
                label="Teléfono"
                name="phone"
                type="text"
                value={form.phone}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Input
            className="px-2"
            errorMessage={errors?.email}
            isInvalid={!!errors?.email}
            label="Correo Electrónico"
            name="email"
            type="text"
            value={form.email}
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
            {text} Piloto
          </Button>
        </form>
      </div>
    </Col>
  );
};
