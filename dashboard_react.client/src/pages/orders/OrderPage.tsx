import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { Col } from "@tremor/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Icon } from "../../components/Icons/Icon";
import { OrderForm } from "../../components/forms/OrderForm";
import { TableRoot } from "../../components/table/TableRoot";
import { Drawer } from "../../containers/Drawer";
import { useOrder } from "../../hooks/useOrder";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getOrders } from "../../services/orderService";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { OrderResponse } from "../../types/OrderResponse";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { initialOrder } from "./CreateOrderPage";
import { DateRangePicker } from "@nextui-org/date-picker";
import { minDateMaxDate } from "../../util/converted";
import { parseDate } from "@internationalized/date";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useDrawer } from "../../hooks/useDrawer";
import { OrderResponseFilteredColumns } from "../../components/columns/OrderResponseFilteredColumns";

const dateRange = minDateMaxDate();

const ModalCreateItem = lazy(() =>
  import("../../components/modals/ModalCreateItem").then((module) => ({
    default: module.ModalCreateItem,
  })),
);

export const OrderPage = () => {
  const [rageOfDate, setRageOfDate] = useState({
    start: dateRange.maxDate,
    end: dateRange.minDate,
  });
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { create, update } = useOrder(rageOfDate);
  const { reRender, render } = useRetraseRender();
  const { order, add } = useOrderStore();
  const { updateDetails } = useOrderDetailStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<OrderResponse[]>,
    ApiError | undefined
  >({
    queryKey: ["orders", rageOfDate.start, rageOfDate.end],
    queryFn: () => getOrders(rageOfDate),
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-person-plus"} /> Crear Orden
          </Button>
        </Col>
        <DateRangePicker
          label="Rango de Fechas de Ordenes"
          defaultValue={{
            start: parseDate(dateRange.minDate),
            end: parseDate(dateRange.maxDate),
          }}
          className="max-w-xs"
          onChange={(date) => {
            setRageOfDate({
              start: date.end.toString(),
              end: date.start.toString(),
            });
          }}
        />
        <TableRoot
          columns={OrderResponseFilteredColumns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de las ordenes"
          styles={compactGrid}
          title={"Ordenes"}
          width={false}
        />
      </div>
      {render && (
        <Drawer
          isOpen={openCreate}
          setIsOpen={setOpenCreate}
          title={`Crear Orden`}
          size="5xl"
        >
          <div className="p-5">
            <OrderForm
              initialForm={initialOrder}
              sendForm={create}
              action="Crear"
              reboot
            />
          </div>
        </Drawer>
      )}
      {render && (
        <Drawer
          isOpen={openUpdate}
          setIsOpen={() => {
            setOpenUpdate();
            add(null);
            updateDetails([]);
          }}
          title={`Editar Cliente`}
          size="5xl"
        >
          <div className="p-5">
            <OrderForm initialForm={order!} sendForm={update} action="Editar" />
          </div>
        </Drawer>
      )}
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItem />
      </Suspense>
    </Protected>
  );
};
