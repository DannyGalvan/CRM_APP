import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialProduct } from "../../pages/product/CreateProductPage";
import { useProductStore } from "../../store/useProductStore";
import { ApiResponse } from "../../types/ApiResponse";
import { ProductRequest } from "../../types/ProductRequest";
import { ProductResponse } from "../../types/ProductResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { productSchema } from "../../util/validations/productValidations";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { Response } from "../messages/Response";

interface ProductFormProps {
  initialForm: ProductRequest | ProductResponse;
  sendForm: (
    product: ProductRequest,
  ) => Promise<ApiResponse<ProductResponse | ValidationFailure[]>>;
  text: string;
  reboot?: boolean;
}

const productValidations = (product: ProductRequest) => {
  let errors: ErrorObject = {};

  product.cost = parseFloat(product.cost.toString());
  product.salePrice = parseFloat(product.salePrice.toString());
  product.stock = parseFloat(product.stock.toString());

  const parce = productSchema.safeParse(product);

  if (!parce.success) {
    errors = handleOneLevelZodError(parce.error);
  }

  return errors;
};

export const ProductForm = ({
  initialForm,
  sendForm,
  text,
  reboot,
}: ProductFormProps) => {
  const { product } = useProductStore();
  const {
    form,
    errors,
    handleSubmit,
    handleChange,
    loading,
    success,
    message,
  } = useForm<ProductRequest, ProductResponse>(
    initialForm ?? initialProduct,
    productValidations,
    sendForm,
    reboot,
  );

  return (
    <Col md={12}>
      <h1 className="text-2xl font-bold text-center">{text} Producto</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
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
          <Input
            isRequired
            className="px-2"
            errorMessage={errors?.description}
            isInvalid={!!errors?.description}
            label="Descripcion"
            name="description"
            type="text"
            value={form.description}
            variant="underlined"
            onChange={handleChange}
          />
          <CatalogueSearch
            defaultValue={product?.family?.name}
            entity="Familia"
            errorMessage={errors?.familyId}
            name="familyId"
            querykey="Families"
            setFormValue={handleChange}
          />
          <Row>
            <Col md={4} sm={12}>
              <Input
                isRequired
                errorMessage={errors?.cost}
                isInvalid={!!errors?.cost}
                label="Costo Q."
                name="cost"
                step={0.01}
                type="number"
                value={form.cost.toString()}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={4} sm={12}>
              <Input
                isRequired
                errorMessage={errors?.salePrice}
                isInvalid={!!errors?.salePrice}
                label="Precio de Venta Q."
                name="salePrice"
                step={0.01}
                type="number"
                value={form.salePrice.toString()}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
            <Col md={4} sm={12}>
              <Input
                errorMessage={errors?.stock}
                isInvalid={!!errors?.stock}
                label="Stock"
                name="stock"
                step={1}
                type="number"
                value={form.stock.toString()}
                variant="underlined"
                onChange={handleChange}
              />
            </Col>
          </Row>
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
            {text} Producto
          </Button>
        </form>
      </div>
    </Col>
  );
};
