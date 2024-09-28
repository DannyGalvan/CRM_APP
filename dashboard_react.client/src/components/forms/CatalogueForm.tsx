import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useCallback, useEffect } from "react";

import { ErrorObject, useForm } from "../../hooks/useForm";
import { SelectedCatalogue } from "../../hooks/useListCollections";
import { initialCatalogue } from "../../pages/catalogue/CreateCataloguePage";
import { ApiResponse } from "../../types/ApiResponse";
import { CatalogueResponse } from "../../types/CatalogueResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { catalogueShema } from "../../util/validations/catalogueValidations";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";
import { useErrorsStore } from "../../store/useErrorsStore";

interface CatalogueFormProps {
  selectedCatalogue: SelectedCatalogue;
  collectionError: ApiError | null;
  initialForm?: CatalogueRequest;
  sendForm: (
    catalogue: CatalogueRequest,
  ) => Promise<ApiResponse<CatalogueResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const validateCatalogue = (catalogue: CatalogueRequest) => {
  let errors: ErrorObject = {};

  const parce = catalogueShema.safeParse(catalogue);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const CatalogueForm = ({
  collectionError,
  selectedCatalogue,
  initialForm,
  sendForm,
  text,
  reboot,
}: CatalogueFormProps) => {
  const { setError } = useErrorsStore();
  const {
    form,
    message,
    errors,
    handleSubmit,
    success,
    handleChange,
    loading,
  } = useForm<CatalogueRequest, CatalogueResponse>(
    initialForm ?? initialCatalogue,
    validateCatalogue,
    sendForm,
    reboot,
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
    },
    [handleChange],
  );

  useEffect(() => {
    if (collectionError) {
      setError(collectionError);
    }
  }, [collectionError, setError]);

  return (
    <>
      <Col className="mt-3" md={12}>
        <h1 className="text-center text-2xl font-bold">
          {text} {selectedCatalogue.name}
        </h1>
        <div>
          {success != null && <Response message={message} type={success!} />}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              errorMessage={errors?.name}
              isInvalid={!!errors?.name}
              label="Ingresa el nombre"
              maxLength={51}
              minLength={3}
              name="name"
              value={form.name}
              variant="underlined"
              onChange={handleInputChange}
            />
            <Input
              isRequired
              errorMessage={errors?.description}
              isInvalid={!!errors?.description}
              label="Ingresa la descripción"
              maxLength={201}
              minLength={3}
              name="description"
              value={form.description}
              variant="underlined"
              onChange={handleInputChange}
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
              {text}
            </Button>
          </form>
        </div>
      </Col>
    </>
  );
};
