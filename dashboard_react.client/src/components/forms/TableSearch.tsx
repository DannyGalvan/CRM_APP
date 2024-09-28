import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Ref } from "react";
import { Icon } from "../Icons/Icon";
import { Col } from "../grid/Col";
import { Row } from "../grid/Row";

interface TableSearchProps {
  selectedField: any;
  columns: any[];
  searchField: Ref<HTMLInputElement>;
  filterData: any;
}

export const TableSearch = ({
  selectedField,
  columns,
  searchField,
  filterData,
}: TableSearchProps) => {
  return (
    <Row className={"mt-4"}>
      <Col sm={12} md={6}>
        <Select
          label="Filtrar por campo"
          className="py-4"
          onChange={selectedField}
          size="sm"
          variant="bordered"
          aria-label="Filtrar por campo"
        >
          {columns
            .filter((x) => x.hasFilter)
            .map((item, _) => (
              <SelectItem key={item.id}>{item.name}</SelectItem>
            ))}
        </Select>
      </Col>
      <Col sm={12} md={6}>
        <article className={"flex"}>
          <Input
            label="Buscar..."
            name="search"
            type="search"
            ref={searchField}
            className={"py-4"}
            size="sm"
            variant="bordered"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                filterData();
              }
            }}
          />
          <Button
            color="primary"
            radius="sm"
            className="mt-[1.1rem] py-[1.5rem]"
            size={"sm"}
            onClick={(e) => {
              e.preventDefault();
              filterData();
            }}
            type="button"
          >
            <Icon name="bi bi-search" />
          </Button>
        </article>
      </Col>
    </Row>
  );
};
