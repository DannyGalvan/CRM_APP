import { TableColumn } from "react-data-table-component";

import { OrderResponse } from "../../types/OrderResponse";

export const OrderResponseColumns: TableColumn<OrderResponse>[] = [
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
    maxWidth: "150px",
    wrap: true,
  },
  {
    id: "address",
    name: "Direccion",
    selector: (data) => data?.customerDirection?.address,
    sortable: true,
    wrap: true,
    maxWidth: "300px",
    omit: false,
  },
  {
    id: "total",
    name: "Total",
    selector: (data) => data.total,
    omit: false,
    sortable: true,
    maxWidth: "100px",
    format: (data) => `Q. ${data.total?.toFixed(2)}`,
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
];
