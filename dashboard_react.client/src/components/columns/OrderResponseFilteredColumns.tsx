import { TableColumn } from "react-data-table-component";
import { OrderResponse } from "../../types/OrderResponse";
import { OrderActionMenu } from "../menu/OrderActionMenu";

export const OrderResponseFilteredColumns: TableColumn<OrderResponse>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data?.id ?? "",
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "name",
    name: "Cliente",
    selector: (data) => data?.customer?.fullName,
    omit: false,
    sortable: true,
  },
  {
    id: "address",
    name: "Direccion",
    selector: (data) => data?.customerDirection?.address,
    omit: false,
    sortable: true,
  },
  {
    id: "total",
    name: "Total",
    selector: (data) => data.total,
    omit: false,
    sortable: true,
    maxWidth: "100px",
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
    selector: (data) => data?.createdAt ?? "",
    sortable: true,
    maxWidth: "200px",
    omit: true,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data?.updatedAt ?? "",
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "deliveryDate",
    name: "Entrega",
    selector: (data) => data.deliveryDate,
    sortable: true,
    maxWidth: "115px",
    omit: false,
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
