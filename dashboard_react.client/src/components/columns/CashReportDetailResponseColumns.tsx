import { TableColumn } from "react-data-table-component";
import { CashReportDetailsResponse } from "../../types/CashReportDetailResponse";
import { CashReportDetailActionMenu } from "../menu/CashReportDetailActionMenu";

export const CashReportDetailResponseColumns: TableColumn<CashReportDetailsResponse>[] =
  [
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
      name: "Cliente",
      selector: (data) => data?.order?.customer?.fullName,
      sortable: true,
      minWidth: "250px",
      maxWidth: "250px",
      omit: false,
    },
    {
      id: "total",
      name: "Total",
      selector: (data) => data.order.total.toFixed(2),
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
        return <CashReportDetailActionMenu data={data} />;
      },
      width: "90px",
      wrap: true,
    },
  ];
