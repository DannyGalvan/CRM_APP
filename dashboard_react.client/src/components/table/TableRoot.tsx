import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { TableColumn } from "react-data-table-component/dist/DataTable/types";

import { PAGINATION_OPTIONS, SELECTED_MESSAGE } from "../../config/contants";
import { useToggle } from "../../hooks/useToggle";
import { customStyles } from "../../theme/tableTheme";
import { hasJsonOrOtherToString } from "../../util/converted";
import { SubHeaderTableButton } from "../button/SubHeaderTableButton";
import { TableRootSearch } from "../forms/TableRootSearch";
import { MesajeNoData } from "../messages/MesajeNoData";
import { ModalTable } from "../modals/ModalTable";
import { LoadingComponent } from "../spinner/LoadingComponent";

interface TableRootProps<T> {
  data: T[];
  pending: boolean;
  width: boolean | undefined;
  text: string;
  columns: TableColumn<T>[];
  title: string;
  styles: object;
  hasFilters: boolean;
  selectedRows?: boolean;
  onSelectedRowsChange?: (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
}

export const TableRoot = <T extends object>({
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
}: TableRootProps<T>) => {
  const { open, toggle } = useToggle();
  const [field, setField] = useState<TableColumn<T> | undefined>(undefined);
  const [filteredData, setFilteredData] = useState(data ?? []);
  const [cols, setCols] = useState(columns);
  const searchField = useRef<HTMLInputElement>(null);

  const filterData = useCallback(() => {
    const searchValue = searchField.current?.value;
    setFilteredData(
      field
        ? data.filter(
            (item) =>
              field?.selector &&
              hasJsonOrOtherToString(item, field.selector)?.includes(
                searchValue ?? "",
              ),
          )
        : data,
    );
  }, [data, field]);

  useEffect(() => {
    filterData();
  }, [data, filterData]);

  const changeVisibilitiColumn = useCallback((column: TableColumn<T>) => {
    column.omit = !column.omit;
    const cols = columns.map((col) => (col.id === column.id ? column : col));
    setCols(cols);
  }, []);

  const selectedField = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setField(columns[e.target.value as unknown as number]);
    },
    [columns],
  );

  const memoizedColumns = useMemo(() => cols, [cols]);
  const memoizedData = useMemo(() => filteredData, [filteredData]);

  return (
    <div className="w-full">
      {hasFilters && (
        <TableRootSearch
          columns={columns}
          filterData={filterData}
          searchField={searchField}
          selectedField={selectedField}
        />
      )}
      <DataTable
        fixedHeader
        highlightOnHover
        pagination
        pointerOnHover
        responsive
        striped
        clearSelectedRows={selectedRows}
        columns={memoizedColumns}
        contextMessage={SELECTED_MESSAGE}
        customStyles={styles ?? customStyles}
        data={memoizedData}
        expandableRows={width}
        fixedHeaderScrollHeight="650px"
        noDataComponent={
          <MesajeNoData mesaje={`No se encontraros datos ${text}`} />
        }
        paginationComponentOptions={PAGINATION_OPTIONS}
        paginationDefaultPage={1}
        paginationPerPage={30}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
        progressComponent={<LoadingComponent />}
        progressPending={pending}
        selectableRows={selectedRows}
        subHeader={true}
        subHeaderComponent={<SubHeaderTableButton onClick={toggle} />}
        subHeaderWrap={true}
        theme="individuality"
        title={title}
        onSelectedRowsChange={onSelectedRowsChange}
      />
      <ModalTable
        changeVisibilitiColumn={changeVisibilitiColumn}
        columns={columns}
        open={open}
        toggle={toggle}
      />
    </div>
  );
};
