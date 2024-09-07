import { TableColumn } from "react-data-table-component";
import { RouteDetailsResponse } from "../../types/RouteDetailsResponse";
import { RouteDetailActionMenu } from "../menu/RouteDetailActionMenu";

export const OrderDetailResponseColumns: TableColumn<RouteDetailsResponse>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "orderId",
    name: "Orden",
    selector: (data) => data.orderId,
    sortable: true,
    minWidth: "250px",
    maxWidth: "250px",
    omit: false,
  },
  {
    id: "total",
    name: "Total",
    selector: (data) => data.order.total,
    sortable: true,
    maxWidth: "100px",
    omit: false,
  },
  {
    id: "deliveryDate",
    name: "F. Entrega",
    selector: (data) => data?.order?.deliveryDate?.toString() ?? "",
    sortable: true,
    maxWidth: "180px",
    omit: false,
    center: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <RouteDetailActionMenu data={data} />;
    },
    width: "90px",
    wrap: true,
  },
];
