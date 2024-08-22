import { Button } from "@nextui-org/button";
import { TableColumn } from "react-data-table-component";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { initialOrder } from "../../pages/orders/CreateOrderPage";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { OrderRequest } from "../../types/OrderRequest";
import { OrderDetailLine, OrderResponse } from "../../types/OrderResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { orderSchema } from "../../util/validations/orderValidations";
import { Col } from "../grid/Col";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { InputDeleteLine } from "../input/InputDeleteLine";
import { InputQuantity } from "../input/InputQuantity";
import { Response } from "../messages/Response";
import { TableRoot } from "../table/TableRoot";
import { Row } from "../grid/Row";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Input } from "@nextui-org/input";

interface OrderFormProps {
  initialForm: OrderRequest | OrderResponse;
  action: string;
  sendForm: (
    order: OrderRequest,
  ) => Promise<ApiResponse<OrderResponse | ValidationFailure[]>>;
  reboot?: boolean;
}

const columns: TableColumn<OrderDetailLine>[] = [
  {
    name: "ID",
    selector: (data) => data.id,
    sortable: true,
    omit: true,
  },
  {
    id: "number",
    name: "Línea",
    selector: (data) => data.numberLine,
    sortable: true,
    omit: false,
    width: "90px",
  },
  {
    id: "product",
    name: "Producto",
    selector: (data) => data.productName,
    sortable: true,
    omit: false,
  },
  {
    id: "quantity",
    name: "Cantidad",
    cell: (data) => <InputQuantity data={data} />,
    sortable: false,
    omit: false,
    width: "90px",
  },
  {
    id: "Price",
    name: "Precio Unitario",
    selector: (data) => data.unitPrice,
    sortable: true,
    omit: false,
  },
  {
    id: "Total",
    name: "Total de Linea",
    selector: (data) => data.totalLine,
    sortable: true,
    omit: false,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => <InputDeleteLine data={data} />,
    sortable: false,
    omit: false,
    center: true,
  },
];

const validateOrder = (order: OrderRequest) => {
  let errors: ErrorObject = {};

  const parce = orderSchema.safeParse(order);

  console.log(parce);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const OrderForm = ({
  initialForm,
  action,
  sendForm,
  reboot,
}: OrderFormProps) => {
  const { order } = useOrderStore();
  const { orderDetail, add, load, changeLoad, total } = useOrderDetailStore();
  const {
    errors,
    handleChange,
    handleSubmit,
    loading,
    success,
    message,
    form,
  } = useForm<OrderRequest, OrderResponse>(
    initialForm ?? initialOrder,
    validateOrder,
    sendForm,
    reboot,
  );

  const handleAddOrderDetail = (selected: any) => {
    add({
      productId: selected.id,
      productName: selected.name,
      quantity: 1,
      unitPrice: selected.salePrice,
    });
    changeLoad();
  };

  const format = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: getLocalTimeZone(),
  });

  return (
    <Col md={12}>
      <h1 className="text-center text-2xl font-bold">{action} Orden</h1>
      <div>
        {success != null && <Response message={message} type={success!} />}
        <form
          className="flex flex-col gap-4 pb-10 pt-5"
          onSubmit={handleSubmit}
        >
          <Row className="justify-end">
            <Col md={6}>
              <Input
                min={today(getLocalTimeZone()).toString()}
                value={format.format(form.deliveryDate)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value
                    .split("-")
                    .map(Number);
                  const fecha = new Date(year, month - 1, day, 0, 0, 0);
                  handleChange({
                    target: { name: "deliveryDate", value: fecha },
                  } as any);
                }}
                name="deliveryDate"
                label="Fecha de Entrega"
                className="max-w"
                type="date"
                pattern="\d{4}-\d{2}-\d{2}"
                errorMessage={errors?.deliveryDate}
                variant="underlined"
                isInvalid={!!errors?.deliveryDate}
              />
            </Col>
          </Row>
          <CatalogueSearch
            name="customerId"
            querykey="Customers"
            entity="Cliente"
            setFormValue={handleChange}
            defaultValue={order?.customer?.firstName}
            errorMessage={errors?.customerId}
            keyName="FullName"
            queryFn={getCustomers}
          />
          <CatalogueSearch
            name="paymentTypeId"
            querykey="PaymentTypes"
            entity="Tipo de Pago"
            setFormValue={handleChange}
            defaultValue={order?.paymentType?.name}
            errorMessage={errors?.paymentTypeId}
          />
          <h2 className="text-center text-xl font-bold">Detalle del pedido</h2>
          <div>
            <CatalogueSearch
              name="productId"
              querykey="Products"
              entity="Agregar Producto"
              setFormValue={handleAddOrderDetail}
              queryFn={getProducts}
              isForm={false}
              keyName="Name"
              required={false}
            />
            <TableRoot
              columns={columns}
              data={orderDetail}
              text="de los detalles del pedido"
              styles={compactGrid}
              title={"Detalles del Pedido"}
              width={false}
              hasFilters={true}
              pending={load}
            />
            <p className="bg-black text-end text-2xl font-bold text-white">
              Total: {total().toFixed(2)}
            </p>
          </div>
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
            {action} Pedido
          </Button>
        </form>
      </div>
    </Col>
  );
};
