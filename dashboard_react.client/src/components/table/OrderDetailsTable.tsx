import DataTable, { TableColumn } from "react-data-table-component";

import { PAGINATION_OPTIONS, SELECTED_MESSAGE } from "../../config/contants";
import { customStyles } from "../../theme/tableTheme";
import { MesajeNoData } from "../messages/MesajeNoData";

interface OrderDetailsTableProps {
  data: any[];
  text: string;
  columns: TableColumn<any>[];
  title: string;
  styles: any;
}

export const OrderDetailsTable = ({
  styles,
  text,
  data,
  title,
  columns,
}: OrderDetailsTableProps) => {
  return (
    <DataTable
      fixedHeader
      highlightOnHover
      pagination
      responsive
      striped
      columns={columns}
      contextMessage={SELECTED_MESSAGE}
      customStyles={styles ?? customStyles}
      data={data}
      fixedHeaderScrollHeight="650px"
      noDataComponent={
        <MesajeNoData mesaje={`No se encontraros datos ${text}`} />
      }
      paginationComponentOptions={PAGINATION_OPTIONS}
      subHeader={true}
      subHeaderWrap={true}
      theme="individuality"
      title={title}
    />
  );
};
