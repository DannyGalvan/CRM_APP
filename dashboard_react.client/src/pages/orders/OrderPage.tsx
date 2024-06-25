import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Col } from "@tremor/react";
import { useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { Icon } from "../../components/Icons/Icon";
import { OrderForm } from "../../components/forms/OrderForm";
import { OrderActionMenu } from "../../components/menu/OrderActionMenu";
import { TableRoot } from "../../components/table/TableRoot";
import { Drawer } from "../../containers/Drawer";
import { DrawerProvider } from "../../context/DrawerContext";
import { useOrder } from "../../hooks/useOrder";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useToggle } from "../../hooks/useToggle";
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

const columns: TableColumn<any>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "name",
    name: "Nombre",
    selector: (data) =>
      `${data?.customer?.firstName} ${data?.customer?.firstLastName}`,
    omit: false,
    sortable: true,
  },
  {
    id: "payment",
    name: "Pago",
    selector: (data) => data?.paymentType?.name,
    sortable: true,
    maxWidth: "150px",
    omit: false,
  },
  {
    id: "status",
    name: "Estado",
    selector: (data) => data?.orderState?.name,
    sortable: true,
    maxWidth: "150px",
    omit: false,
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <OrderActionMenu data={data} />;
    },
    wrap: true,
  },
];

export const OrderPage = () => {
  const { open, toggle } = useToggle();
  const { reRender, render } = useRetraseRender();
  const { open: openUpdate, toggle: toggleUpdate } = useToggle();
  const { create, update } = useOrder();
  const { order, add } = useOrderStore();
  const { updateDetails } = useOrderDetailStore();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<OrderResponse[]>,
    ApiError | undefined
  >({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <DrawerProvider setOpenUpdate={toggleUpdate}>
        <div className="mt-20 md:mt-0">
          <Col className="mt-5 flex justify-end">
            <Button color={"secondary"} onClick={toggle}>
              <Icon name={"bi bi-person-plus"} /> Crear Orden
            </Button>
          </Col>
          <TableRoot
            columns={columns}
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
            isOpen={open}
            setIsOpen={toggle}
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
              toggleUpdate();
              add(null);
              updateDetails([]);
            }}
            title={`Editar Cliente`}
            size="5xl"
          >
            <div className="p-5">
              <OrderForm
                initialForm={order!}
                sendForm={update}
                action="Editar"
              />
            </div>
          </Drawer>
        )}
      </DrawerProvider>
    </Protected>
  );
};
