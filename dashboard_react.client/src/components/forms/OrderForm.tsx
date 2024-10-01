import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

import { QueryKeys, nameRoutes } from "../../config/contants";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { ModalType } from "../../hooks/useModalStrategies";
import {
  onSearchUpdate,
  updateSearch,
} from "../../obsevables/searchObservable";
import { initialOrder } from "../../pages/orders/CreateOrderPage";
import { getCustomerAddress } from "../../services/customerAddressService";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { OrderRequest } from "../../types/OrderRequest";
import { OrderResponse } from "../../types/OrderResponse";
import { ProductResponse } from "../../types/ProductResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { handleOneLevelZodError } from "../../util/converted";
import { orderSchema } from "../../util/validations/orderValidations";
import { Icon } from "../Icons/Icon";
import { OrderDetailLineColumns } from "../columns/OrderDetailLineColumns";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";
import { CatalogueSearch } from "../input/CatalogueSearch";
import { ButtonAnimatedLink } from "../links/ButtonAnimatedLink";
import { Response } from "../messages/Response";
import { TableRoot } from "../table/TableRoot";

interface OrderFormProps {
  initialForm: OrderRequest | OrderResponse;
  action: string;
  sendForm: (
    order: OrderRequest,
  ) => Promise<ApiResponse<OrderResponse | ValidationFailure[]>>;
  reboot?: boolean;
}

const validateOrder = (order: OrderRequest) => {
  let errors: ErrorObject = {};

  const parce = orderSchema.safeParse(order);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const OrderForm = ({
  initialForm,
  action,
  sendForm,
  reboot,
}: OrderFormProps) => {
  const [reminder, setReminder] = useState<string>("0.00");
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

  useEffect(() => {
    const subscription = onSearchUpdate("Reminder").subscribe((event) => {
      setReminder(event.value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddOrderDetail = (selected: ProductResponse) => {
    if (selected.name?.toLowerCase().includes("envio")) {
      add({
        productId: selected.id,
        productName: selected.name,
        quantity: 1,
        unitPrice: parseFloat(reminder),
      });
    } else {
      add({
        productId: selected.id,
        productName: selected.name,
        quantity: 1,
        unitPrice: selected.salePrice,
      });
    }
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
      <h1 className="text-2xl font-bold text-center">{action} Orden</h1>
      <div>
        {success != null && <Response message={message} type={success} />}
        <form
          className="flex flex-col gap-4 pt-5 pb-10"
          onSubmit={handleSubmit}
        >
          <Row className="justify-end">
            <Col md={6}>
              <ButtonAnimatedLink
                color={"secondary"}
                to={`${nameRoutes.route}/${nameRoutes.create}`}
              >
                <Icon name={"bi bi-sign-turn-right"} /> Crear Rutas
              </ButtonAnimatedLink>
            </Col>
            <Col md={6}>
              <Input
                className="w-max"
                errorMessage={errors?.deliveryDate}
                isInvalid={!!errors?.deliveryDate}
                label="Fecha de Entrega"
                min={today(getLocalTimeZone()).toString()}
                name="deliveryDate"
                pattern="\d{4}-\d{2}-\d{2}"
                type="date"
                value={format.format(form.deliveryDate)}
                variant="underlined"
                onChange={(e) => {
                  const [year, month, day] = e.target.value
                    .split("-")
                    .map(Number);
                  const fecha = new Date(year, month - 1, day, 0, 0, 0);
                  handleChange({
                    target: { name: "deliveryDate", value: fecha },
                  } as any);
                }}
              />
            </Col>
          </Row>
          <CatalogueSearch
            defaultValue={order?.customer?.fullName}
            entity="Cliente"
            errorMessage={errors?.customerId}
            keyName="FullName"
            name="customerId"
            queryFn={getCustomers}
            querykey={QueryKeys.Customers as ModalType}
            selector={(selected) => {
              setReminder(selected.shippingFee?.toFixed(2));
            }}
            setFormValue={handleChange}
            unSelector={() => {
              setReminder("0.00");
              updateSearch(QueryKeys.CustomerDirections, "");
            }}
          />
          <CatalogueSearch
            aditionalFilter={` AND CustomerId:eq:${form.customerId}`}
            defaultValue={order?.customerDirection?.address}
            disabled={form.customerId === ""}
            entity="Direccion del Cliente"
            errorMessage={errors?.customerDirectionId}
            keyName="Address"
            name="customerDirectionId"
            queryFn={getCustomerAddress}
            querykey={QueryKeys.CustomerDirections as ModalType}
            setFormValue={handleChange}
          />
          <CatalogueSearch
            defaultValue={order?.paymentType?.name}
            entity="Tipo de Pago"
            errorMessage={errors?.paymentTypeId}
            name="paymentTypeId"
            querykey={QueryKeys.PaymentTypes as ModalType}
            setFormValue={handleChange}
          />
          <span className="font-bold text-right text-medium text-cyan-500">
            Recordatorio Envio: Q {reminder}
          </span>
          <p className="font-bold text-red-600">{errors?.orderDetails ?? ""}</p>
          <h2 className="text-xl font-bold text-center">Detalle del pedido</h2>
          <div>
            <CatalogueSearch
              entity="Agregar Producto"
              errorMessage={errors?.productId}
              isForm={false}
              keyAdd="stock"
              keyName="Name"
              name="productId"
              queryFn={getProducts}
              querykey={QueryKeys.Products as ModalType}
              required={false}
              setValue={handleAddOrderDetail}
            />
            <TableRoot
              columns={OrderDetailLineColumns}
              data={orderDetail}
              hasFilters={true}
              pending={load}
              styles={compactGrid}
              text="de los detalles del pedido"
              title={"Detalles del Pedido"}
              width={false}
            />
            <p className="text-2xl font-bold text-white bg-black text-end">
              Total: Q {total().toFixed(2)}
            </p>
          </div>
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
            {action} Pedido
          </Button>
        </form>
      </div>
    </Col>
  );
};
