import { Button, Input, Select, SelectItem } from "@nextui-org/react";
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
    <Row className={"my-4"}>
      <Col sm={12} md={6}>
        <Select
          label="Filtrar por campo"
          className="py-4"
          onChange={selectedField}
          size="md"
          variant="bordered"
          draggable={true}
        >
          {columns.map((item, index) => (
            <SelectItem
              key={index}
            >
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </Col>
      <Col sm={12} md={6}>
        <form className={"flex"}>
          <Input
            label="Buscar..."
            name="search"
            type="text"
            ref={searchField}
            className={"py-4"}
            size="md"
            variant="bordered"
          />
          <Button
            color="primary"
            radius="sm"
            className="mt-[1.1rem] py-[1.6rem]"
            size={"md"}
            onClick={(e) => {
              e.preventDefault();
              filterData();
            }}
            type="submit"
          >
            <Icon name="bi bi-search" />
          </Button>
        </form>
      </Col>
    </Row>
  );
};
