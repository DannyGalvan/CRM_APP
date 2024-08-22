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
      <h1 className="text-center text-2xl font-bold">{text} Producto</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form className="flex flex-col gap-4 pb-10" onSubmit={handleSubmit}>
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
          <Input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            label="Descripcion"
            isRequired
            errorMessage={errors?.description}
            variant="underlined"
            isInvalid={!!errors?.description}
            className="px-2"
          />
          <CatalogueSearch
            querykey="Families"
            entity="Familia"
            errorMessage={errors?.familyId}
            setFormValue={handleChange}
            name="familyId"
            defaultValue={product?.family?.name}
          />
          <Row>
            <Col md={4} sm={12}>
              <Input
                type="number"
                step={0.01}
                name="cost"
                value={form.cost.toString()}
                onChange={handleChange}
                label="Costo"
                errorMessage={errors?.cost}
                variant="underlined"
                isInvalid={!!errors?.cost}
                isRequired
              />
            </Col>
            <Col md={4} sm={12}>
              <Input
                type="number"
                step={0.01}
                name="salePrice"
                value={form.salePrice.toString()}
                onChange={handleChange}
                label="Precio de Venta"
                errorMessage={errors?.salePrice}
                variant="underlined"
                isInvalid={!!errors?.salePrice}
                isRequired
              />
            </Col>
            <Col md={4} sm={12}>
              <Input
                type="number"
                step={1}
                name="stock"
                value={form.stock.toString()}
                onChange={handleChange}
                label="Stock"
                errorMessage={errors?.stock}
                variant="underlined"
                isInvalid={!!errors?.stock}
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
            {text} Producto
          </Button>
        </form>
      </div>
    </Col>
  );
};
