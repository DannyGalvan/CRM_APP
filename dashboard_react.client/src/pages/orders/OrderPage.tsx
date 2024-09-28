import { Button } from "@nextui-org/button";
import { Col } from "@tremor/react";
import { Suspense, useEffect } from "react";
import { Icon } from "../../components/Icons/Icon";
import { OrderForm } from "../../components/forms/OrderForm";
import { Drawer } from "../../containers/Drawer";
import { useOrder } from "../../hooks/useOrder";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getFilteredOrders } from "../../services/orderService";
import { useOrderDetailStore } from "../../store/useOrderDetailStore";
import { useOrderStore } from "../../store/useOrderStore";
import { compactGrid } from "../../theme/tableTheme";
import { OrderResponse } from "../../types/OrderResponse";
import { initialOrder } from "./CreateOrderPage";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useDrawer } from "../../hooks/useDrawer";
import { OrderResponseFilteredColumns } from "../../components/columns/OrderResponseFilteredColumns";
import { QueryKeys } from "../../config/contants";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";
import { TableServer } from "../../components/table/TableServer";

export const OrderPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { create, update } = useOrder();
  const { reRender, render } = useRetraseRender();
  const { order, add, filters, setFilters } = useOrderStore();
  const { updateDetails } = useOrderDetailStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-person-plus"} /> Crear Orden
          </Button>
        </Col>
        <TableServer<OrderResponse>
          fieldRangeOfDates="CreatedAt"
          hasRangeOfDates={true}
          columns={OrderResponseFilteredColumns}
          queryKey={QueryKeys.Orders}
          hasFilters={true}
          queryFn={getFilteredOrders}
          text="de las ordenes"
          styles={compactGrid}
          title={"Ordenes"}
          width={false}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      {render && (
        <Drawer
          isOpen={openCreate}
          setIsOpen={setOpenCreate}
          title={`Crear Orden`}
          size="5xl"
          id="create"
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
          title={`Editar Orden`}
          size="5xl"
          id="update"
        >
          <div className="p-5">
            <OrderForm initialForm={order!} sendForm={update} action="Editar" />
          </div>
        </Drawer>
      )}
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
