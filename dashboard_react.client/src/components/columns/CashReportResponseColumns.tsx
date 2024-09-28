import { CashReportResponse } from "../../types/CashReportResponse";
import { CashReportActionMenu } from "../menu/CashReportActionMenu";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";

export const CashReportResponseColumns: TableColumnWithFilters<CashReportResponse>[] =
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
      id: "cashierName",
      name: "Cajero",
      selector: (data) => data.cashierName,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `CashierName:like:${value}` : ""),
    },
    {
      id: "observations",
      name: "Observaciones",
      selector: (data) => data.observations,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Observations:like:${value}` : ""),
    },
    {
      id: "total",
      name: "Total",
      selector: (data) => data.total,
      format: (data) => `Q. ${data.total?.toFixed(2)}`,
      sortable: true,
      wrap: true,
      omit: false,
      hasFilter: true,
      filterField: (value) => (value ? `Total:gt:${value}` : ""),
    },
    {
      id: "state",
      name: "Estado",
      selector: (data) => (data.state == 1 ? "Creado" : "Eliminado"),
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
      hasFilter: true,
      filterField: (value) => (value ? `CreatedAt:gt:${value}T00` : ""),
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
