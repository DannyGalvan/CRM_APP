import DataTable from "react-data-table-component";
import { customStyles } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { TableColumnWithFilters } from "../../types/TableColumnWithFilters";
import { PAGINATION_OPTIONS, SELECTED_MESSAGE } from "../../config/contants";
import { SubHeaderTableButton } from "../button/SubHeaderTableButton";
import { useToggle } from "../../hooks/useToggle";
import { LoadingComponent } from "../spinner/LoadingComponent";
import { MesajeNoData } from "../messages/MesajeNoData";
import { ModalTable } from "../modals/ModalTable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../../util/errors";
import { TableSearch } from "../forms/TableSearch";
import { useErrorsStore } from "../../store/useErrorsStore";
import { InputDateSelector } from "../input/InputDateSelector";
import { useRangeOfDatesStore } from "../../store/useRangeOfDatesStore";
import { ListFilter } from "../../types/LIstFilter";

export interface TableServerProps<T> {
  columns: TableColumnWithFilters<T>[];
  queryKey: string;
  filters: ListFilter;
  setFilters: (filters: ListFilter) => void;
  queryFn: (
    filters: string,
    page: number,
    pageSize: number,
  ) => Promise<ApiResponse<T[]>>;
  title: string;
  text: string;
  styles: any;
  hasFilters?: boolean;
  hasRangeOfDates?: boolean;
  fieldRangeOfDates?: string;
  width?: boolean;
  selectedRows?: boolean;
  onSelectedRowsChange?: (state: any) => void;
}

export const TableServer = <T extends {}>({
  queryKey,
  queryFn,
  columns,
  text,
  title,
  width,
  filters,
  setFilters,
  hasFilters = true,
  hasRangeOfDates = false,
  fieldRangeOfDates,
  selectedRows,
  onSelectedRowsChange,
  styles,
}: TableServerProps<T>) => {
  const { open, toggle } = useToggle();
  const { setError } = useErrorsStore();
  const { end, start, getDateFilters } = useRangeOfDatesStore();
  const [field, setField] = useState<TableColumnWithFilters<T> | undefined>(
    undefined,
  );
  const [cols, setCols] = useState(columns);
  const searchField = useRef<HTMLInputElement>(null);

  const {
    data,
    isPending,
    error: apiError,
  } = useQuery<ApiResponse<T[]>, ApiError>({
    queryKey: [
      queryKey,
      filters.filter,
      hasRangeOfDates ? end : "",
      hasRangeOfDates ? start : "",
      filters.page,
      filters.pageSize,
    ],
    queryFn: () =>
      queryFn(
        hasRangeOfDates
          ? `${getDateFilters(fieldRangeOfDates!)}${filters.filter ? ` AND ${filters.filter}` : ""}`
          : `${filters.filter ? `${filters.filter}` : ""}`,
        filters.page,
        filters.pageSize,
      ),
  });

  const changeVisibilitiColumn = useCallback(
    (column: TableColumnWithFilters<T>) => {
      column.omit = !column.omit;
      const cols = columns.map((col) => (col.id === column.id ? column : col));
      setCols(cols);
    },
    [],
  );

  const selectedField = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setField(columns.find((col) => col.id === e.target.value));
    },
    [columns],
  );

  const filterData = () => {
    const searchValue = searchField.current?.value;
    const filter =
      field && field.filterField ? field.filterField(searchValue) : "";
    setFilters({
      ...filters,
      filter,
    });
  };

  const memoizedColumns = useMemo(() => cols, [cols]);

  useEffect(() => {
    if (apiError) {
      setError({
        statusCode: apiError.statusCode,
        message: apiError.message,
        name: apiError.name,
      });
    }
  }, [apiError, setError]);

  return (
    <div className="w-full">
      {hasRangeOfDates && <InputDateSelector label="Rango de Fechas Ordenes" />}
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
        pagination
        paginationServer
        paginationTotalRows={data?.totalResults}
        onChangeRowsPerPage={(rows, current) => {
          setFilters({
            ...filters,
            pageSize: rows,
            page: current,
          });
        }}
        onChangePage={(page, _) => {
          setFilters({
            ...filters,
            page,
          });
        }}
        contextMessage={SELECTED_MESSAGE}
        columns={memoizedColumns}
        data={data?.data ?? []}
        title={title}
        subHeaderComponent={<SubHeaderTableButton onClick={toggle} />}
        subHeaderWrap={true}
        striped
        expandableRows={width}
        paginationComponentOptions={PAGINATION_OPTIONS}
        subHeader={true}
        fixedHeader
        selectableRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        fixedHeaderScrollHeight="650px"
        theme="individuality"
        highlightOnHover
        clearSelectedRows={selectedRows}
        pointerOnHover
        progressPending={isPending}
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
        changeVisibilitiColumn={changeVisibilitiColumn as any}
      />
    </div>
  );
};
