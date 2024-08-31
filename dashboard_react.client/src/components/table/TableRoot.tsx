import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { TableColumn } from "react-data-table-component/dist/DataTable/types";
import { PAGINATION_OPTIONS, SELECTED_MESSAGE } from "../../config/contants";
import { useToggle } from "../../hooks/useToggle";
import { customStyles } from "../../theme/tableTheme";
import { hasJsonOrOtherToString } from "../../util/converted";
import { SubHeaderTableButton } from "../button/SubHeaderTableButton";
import { TableSearch } from "../forms/TableSearch";
import { MesajeNoData } from "../messages/MesajeNoData";
import { ModalTable } from "../modals/ModalTable";
import { LoadingComponent } from "../spinner/LoadingComponent";

interface TableRootProps {
  data: any[];
  pending: boolean;
  width: boolean | undefined;
  text: string;
  columns: TableColumn<any>[];
  title: string;
  styles: any;
  hasFilters: boolean;
  selectedRows?: boolean;
  onSelectedRowsChange?: (state: any) => void;
}

export const TableRoot = ({
  data,
  pending,
  width,
  text,
  columns,
  title,
  styles,
  hasFilters = true,
  selectedRows = false,
  onSelectedRowsChange,
}: TableRootProps) => {
  const { open, toggle } = useToggle();
  const [field, setField] = useState<TableColumn<any> | undefined>(undefined);
  const [filteredData, setFilteredData] = useState(data ?? []);
  const [cols, setCols] = useState(columns);
  const searchField = useRef<HTMLInputElement>(null);

  const filterData = useCallback(() => {
    const searchValue = searchField.current?.value;
    setFilteredData(
      field
        ? data.filter((item) =>
            hasJsonOrOtherToString(item, field.selector!)?.includes(
              searchValue!,
            ),
          )
        : data,
    );
  }, [data, field]);

  useEffect(() => {
    filterData();
  }, [data, filterData]);

  const changeVisibilitiColumn = useCallback((column: TableColumn<any>) => {
    column.omit = !column.omit;
    const cols = columns.map((col) => (col.id === column.id ? column : col));
    setCols(cols);
  }, []);

  const selectedField = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      console.log(e.target.value);
      setField(columns[e.target.value as any]);
      console.log(columns[e.target.value as any]);
    },
    [columns],
  );

  const memoizedColumns = useMemo(() => cols, [cols]);
  const memoizedData = useMemo(() => filteredData, [filteredData]);

  return (
    <div className="w-full">
      {hasFilters && (
        <TableSearch
          columns={columns}
          searchField={searchField}
          selectedField={selectedField}
          filterData={filterData}
        />
      )}
      <DataTable
        responsive
        contextMessage={SELECTED_MESSAGE}
        columns={memoizedColumns}
        data={memoizedData}
        title={title}
        subHeaderComponent={<SubHeaderTableButton onClick={toggle} />}
        subHeaderWrap={true}
        pagination
        striped
        expandableRows={width}
        // expandableRowsComponent={ExpandedComponent}
        paginationComponentOptions={PAGINATION_OPTIONS}
        subHeader={true}
        fixedHeader
        selectableRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        fixedHeaderScrollHeight="650px"
        theme="individuality"
        highlightOnHover
        progressPending={pending}
        progressComponent={<LoadingComponent />}
        noDataComponent={
          <MesajeNoData mesaje={`No se encontraros datos ${text}`} />
        }
        customStyles={styles ?? customStyles}
      />
      <ModalTable
        columns={columns}
        open={open}
        toggle={toggle}
        changeVisibilitiColumn={changeVisibilitiColumn}
      />
    </div>
  );
};
