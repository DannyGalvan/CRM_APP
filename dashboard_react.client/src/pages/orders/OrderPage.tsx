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
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useDrawer } from "../../hooks/useDrawer";
import { OrderResponseFilteredColumns } from "../../components/columns/OrderResponseFilteredColumns";
import { QueryKeys } from "../../config/contants";
import { ModalCreateItemAsync } from "../../components/modals/ModalCreateItemAsync";
import { TableServer } from "../../components/table/TableServer";

import { initialOrder } from "./CreateOrderPage";

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
          columns={OrderResponseFilteredColumns}
          fieldRangeOfDates="CreatedAt"
          filters={filters}
          hasFilters={true}
          hasRangeOfDates={true}
          queryFn={getFilteredOrders}
          queryKey={QueryKeys.Orders}
          setFilters={setFilters}
          styles={compactGrid}
          text="de las ordenes"
          title={"Ordenes"}
          width={false}
        />
      </div>
      {render && (
        <Drawer
          id="create"
          isOpen={openCreate}
          setIsOpen={setOpenCreate}
          size="5xl"
          title={`Crear Orden`}
        >
          <div className="p-5">
            <OrderForm
              reboot
              action="Crear"
              initialForm={initialOrder}
              sendForm={create}
            />
          </div>
        </Drawer>
      )}
      {render && (
        <Drawer
          id="update"
          isOpen={openUpdate}
          setIsOpen={() => {
            setOpenUpdate();
            add(null);
            updateDetails([]);
          }}
          size="5xl"
          title={`Editar Orden`}
        >
          <div className="p-5">
            <OrderForm action="Editar" initialForm={order!} sendForm={update} />
          </div>
        </Drawer>
      )}
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItemAsync />
      </Suspense>
    </Protected>
  );
};
