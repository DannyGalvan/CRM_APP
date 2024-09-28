import { OrderResponse } from "../../types/OrderResponse";
import { OrderActionMenu } from "../menu/OrderActionMenu";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const OrderResponseFilteredColumns: TableColumnWithFilters<OrderResponse>[] =
  [
    {
      id: "id",
      name: "Id",
      selector: (data) => data?.id ?? "",
      sortable: true,
      maxWidth: "150px",
      omit: true,
      filterField: (value) => value ? `_id:eq:${value}` : "",
      hasFilter: true,      
    },
    {
      id: "name",
      name: "Cliente",
      selector: (data) => data?.customer?.fullName,
      omit: false,
      sortable: true,
      reorder: true,
      filterField: (value) => (value ? `Customer.FullName:like:${value}` : ""),
      hasFilter: true,  
    },
    {
      id: "address",
      name: "Direccion",
      selector: (data) => data?.customerDirection?.address,
      omit: false,
      sortable: true,
      wrap: true,
      reorder: true,
      filterField: (value) =>
        value ? `CustomerDirection.Address:like:${value} ` : "",
      hasFilter: true,
    },
    {
      id: "total",
      name: "Total",
      selector: (data) => data.total,
      omit: false,
      sortable: true,
      maxWidth: "100px",
      format: (data) => `Q. ${data.total?.toFixed(2)}`,
      reorder: true,
      filterField: (value) => (value ? `Total:like:${value} ` : ""),
      hasFilter: true,
    },
    {
      id: "payment",
      name: "Pago",
      selector: (data) => data?.paymentType?.name,
      sortable: true,
      maxWidth: "150px",
      omit: false,
      reorder: true,
      filterField: (value) => (value ? `PaymentType.Name:like:${value}` : ""),
      hasFilter: true,
    },
    {
      id: "status",
      name: "Estado",
      selector: (data) => data?.orderState?.name,
      sortable: true,
      maxWidth: "150px",
      omit: false,
      reorder: true,
      filterField: (value) => (value ? `OrderState.Name:like:${value}` : ""),
      hasFilter: true,
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
      reorder: true,
    },
    {
      id: "deliveryDate",
      name: "Entregas",
      selector: (data) => data.deliveryDate,
      sortable: true,
      maxWidth: "115px",
      omit: false,
      reorder: true,
      hasFilter: true,
      filterField: (value) => (value ? `DeliveryDate:gt:${value}T00` : ""),
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
