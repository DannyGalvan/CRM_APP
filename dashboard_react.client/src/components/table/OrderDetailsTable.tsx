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
      responsive
      contextMessage={SELECTED_MESSAGE}
      columns={columns}
      data={data}
      title={title}
      subHeaderWrap={true}
      pagination
      striped
      // expandableRowsComponent={ExpandedComponent}
      paginationComponentOptions={PAGINATION_OPTIONS}
      subHeader={true}
      fixedHeader
      fixedHeaderScrollHeight="650px"
      theme="individuality"
      highlightOnHover
      noDataComponent={
        <MesajeNoData mesaje={`No se encontraros datos ${text}`} />
      }
      customStyles={styles ?? customStyles}
    />
  );
};
