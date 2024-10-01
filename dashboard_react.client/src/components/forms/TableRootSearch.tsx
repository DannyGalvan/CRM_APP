import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Ref } from "react";
import { TableColumn } from "react-data-table-component";

import { Icon } from "../Icons/Icon";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";

interface TableRootSearchProps<T> {
  selectedField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  columns: TableColumn<T>[];
  searchField: Ref<HTMLInputElement>;
  filterData: () => void;
}

export const TableRootSearch = <T extends object>({
  selectedField,
  columns,
  searchField,
  filterData,
}: TableRootSearchProps<T>) => {
  return (
    <Row className={"mt-4"}>
      <Col md={6} sm={12}>
        <Select
          aria-label="Filtrar por campo"
          className="py-4"
          label="Filtrar por campo"
          size="sm"
          variant="bordered"
          onChange={selectedField}
        >
          {columns.map((item, index) => (
            <SelectItem key={index}>{item.name}</SelectItem>
          ))}
        </Select>
      </Col>
      <Col md={6} sm={12}>
        <article className={"flex"}>
          <Input
            ref={searchField}
            className={"py-4"}
            label="Buscar..."
            name="search"
            size="sm"
            type="search"
            variant="bordered"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                filterData();
              }
            }}
          />
          <Button
            className="mt-1.1rem py-1.5rem"
            color="primary"
            radius="sm"
            size={"sm"}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              filterData();
            }}
          >
            <Icon name="bi bi-search" />
          </Button>
        </article>
      </Col>
    </Row>
  );
};
