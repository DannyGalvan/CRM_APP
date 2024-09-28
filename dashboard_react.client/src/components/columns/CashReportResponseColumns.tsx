import { TableColumn } from "react-data-table-component";
import { CashReportResponse } from "../../types/CashReportResponse";
import { CashReportActionMenu } from "../menu/CashReportActionMenu";


export const CashReportResponseColumns: TableColumn<CashReportResponse>[] = [
    {
      id: "id",
      name: "Id",
      selector: (data) => data.id,
      sortable: true,
      maxWidth: "150px",
      omit: true,
    },
    {
      id: "cashierName",
      name: "Cajero",
      selector: (data) => data.cashierName,
      sortable: true,
      wrap: true,
      omit: false,
    },
    {
      id: "observations",
      name: "Observaciones",
      selector: (data) => data.observations,
      sortable: true,
      wrap: true,
      omit: false,
    },
    {
      id: "total",
      name: "Total",
      selector: (data) => data.total,
      format: (data) => `Q. ${data.total?.toFixed(2)}`,
      sortable: true,
      wrap: true,
      omit: false,
    },
    {
      id: "createdAt",
      name: "Creado",
      selector: (data) => data.createdAt ?? "",
      sortable: true,
      maxWidth: "160px",
      omit: false,
    },
    {
      id: "updatedAt",
      name: "Actualizado",
      selector: (data) => data.updatedAt ?? "",
      sortable: true,
      maxWidth: "160px",
      omit: true,
    },
    {
      id: "actions",
      name: "Acciones",
      cell: (data) => {
        return <CashReportActionMenu data={data} />;
      },
      wrap: true,
    },
  ];