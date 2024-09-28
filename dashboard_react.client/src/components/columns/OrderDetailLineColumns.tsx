import { TableColumn } from "react-data-table-component";

import { OrderDetailLine } from "../../types/OrderResponse";
import { InputQuantity } from "../input/InputQuantity";
import { InputDeleteLine } from "../input/InputDeleteLine";
import { InputPrice } from "../input/InputPrice";

export const OrderDetailLineColumns: TableColumn<OrderDetailLine>[] = [
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
    cell: (data) => <InputPrice data={data} />,
    sortable: true,
    omit: false,
  },
  {
    id: "Total",
    name: "Total de Linea",
    selector: (data) => data.totalLine,
    format: (data) => `Q. ${data.totalLine?.toFixed(2)}`,
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
