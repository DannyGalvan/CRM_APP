import { Button, Input } from "@nextui-org/react";
import { useCallback } from "react";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { SelectedCatalogue } from "../../hooks/useListCollections";
import { initialCatalogue } from "../../pages/catalogue/CreateCataloguePage";
import { NotFound } from "../../pages/error/NotFound";
import { ApiResponse } from "../../types/ApiResponse";
import { CatalogueResponse } from "../../types/CatalogueResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { catalogueShema } from "../../util/validations/catalogueValidations";
import { Col } from "../grid/Col";
import { Response } from "../messages/Response";

interface CatalogueFormProps {
  selectedCatalogue: SelectedCatalogue;
  collectionError: ApiError | null;
  initialForm: CatalogueRequest;
  sendForm: (
    catalogue: CatalogueRequest,
  ) => Promise<ApiResponse<CatalogueResponse | ValidationFailure[]>>;
  text: string;
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
}: CatalogueFormProps) => {
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
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
    },
    [handleChange],
  );

  if (collectionError) {
    return (
      <NotFound
        Message={collectionError.message}
        Number={collectionError.statusCode}
      />
    );
  }

  return (
    <>
      <Col md={12} className="mt-3">
        <h1 className="text-center text-2xl font-bold">
          {text} {selectedCatalogue.name}
        </h1>
        <div>
          {success != null && <Response message={message} type={success!} />}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Ingresa el nombre"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              errorMessage={errors?.name}
              isInvalid={!!errors?.name}
              variant="underlined"
              maxLength={51}
              minLength={3}
              isRequired
            />
            <Input
              label="Ingresa la descripción"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              errorMessage={errors?.description}
              isInvalid={!!errors?.description}
              variant="underlined"
              maxLength={201}
              minLength={3}
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
              {text}
            </Button>
          </form>
        </div>
      </Col>
    </>
  );
};
