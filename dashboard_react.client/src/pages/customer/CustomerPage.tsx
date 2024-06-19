import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Col } from "@tremor/react";
import { useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { Icon } from "../../components/Icons/Icon";
import { CustomerForm } from "../../components/forms/CustomerForm";
import { CatalogueActionMenu } from "../../components/menu/CatalogueActionMenu";
import { TableRoot } from "../../components/table/TableRoot";
import { Drawer } from "../../containers/Drawer";
import { DrawerProvider } from "../../context/DrawerContext";
import { useCustomer } from "../../hooks/useCustomer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { useToggle } from "../../hooks/useToggle";
import Protected from "../../routes/middlewares/Protected";
import { getCustomers } from "../../services/customerService";
import { useCustomerStore } from "../../store/useCustomerStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { CustomerResponse } from "../../types/CustomerResponse";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { initialCustomer } from "./CustomerCreatePage";

const columns: TableColumn<any>[] = [
  {
    id: "id",
    name: "Id",
    selector: (data) => data.id,
    sortable: true,
    maxWidth: "150px",
    omit: true,
  },
  {
    id: "firstName",
    name: "Nombre",
    selector: (data) => data.firstName,
    sortable: true,
    maxWidth: "150px",
    omit: false,
  },
  {
    id: "secondName",
    name: "Segundo Nombre",
    selector: (data) => data.secondName,
    sortable: true,
    wrap: true,
    omit: true,
  },
  {
    id: "firstLastName",
    name: "Apellido",
    selector: (data) => data.firstLastName,
    sortable: true,
    maxWidth: "130px",
  },
  {
    id: "secondLastName",
    name: "Segundo Apellido",
    selector: (data) => data.secondLastName,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "address",
    name: "Direccion",
    selector: (data) => data.address,
    sortable: true,
    maxWidth: "160px",
    omit: false,
  },
  {
    id: "phone",
    name: "Telefono",
    selector: (data) => data.firstPhone,
    sortable: true,
    maxWidth: "155px",
    omit: false,
  },
  {
    id: "secondPhone",
    name: "Telefono 2",
    selector: (data) => data.secondPhone,
    sortable: true,
    maxWidth: "155px",
    omit: true,
  },
  {
    id: "department",
    name: "Departamento",
    selector: (data) => data?.department?.name,
    sortable: true,
    maxWidth: "155px",
    omit: false,
  },
  {
    id: "municipality",
    name: "Municipio",
    selector: (data) => data?.municipality?.name,
    sortable: true,
    maxWidth: "155px",
    omit: false,
  },
  {
    id: "zone",
    name: "Zona",
    selector: (data) => data?.zone?.name,
    sortable: true,
    maxWidth: "125px",
    omit: false,
  },
  {
    id: "colony_condominium",
    name: "Colonia/Condominio",
    selector: (data) => data.colony_Condominium,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "createdAt",
    name: "Creado",
    selector: (data) => data.createdAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "updatedAt",
    name: "Actualizado",
    selector: (data) => data.updatedAt,
    sortable: true,
    maxWidth: "160px",
    omit: true,
  },
  {
    id: "actions",
    name: "Acciones",
    cell: (data) => {
      return <CatalogueActionMenu data={data} useStore={useCustomerStore} />;
    },
    wrap: true,
  },
];

export const CustomerPage = () => {
  const { open, toggle } = useToggle();
  const { open: openUpdate, toggle: toggleUpdate } = useToggle();
  const { reRender, render } = useRetraseRender();
  const { customer, add } = useCustomerStore();
  const { create, update } = useCustomer();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<CustomerResponse[]>,
    ApiError | undefined
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
   <Protected>
       <DrawerProvider setOpenUpdate={toggleUpdate}>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={toggle}>
            <Icon name={"bi bi-person-plus"} /> Crear Cliente
          </Button>
        </Col>
        <TableRoot
          columns={columns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de los clientes"
          styles={compactGrid}
          title={"Clientes"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={open}
            setIsOpen={toggle}
            title={`Crear Cliente`}
            size="2xl"
          >
            <div className="p-5">
              <CustomerForm
                initialForm={initialCustomer}
                sendForm={create}
                text="Crear"
              />
            </div>
          </Drawer>
        )}
        {render && (
          <Drawer
            isOpen={openUpdate}
            setIsOpen={() => {
              toggleUpdate();
              add(null);
            }}
            title={`Editar Cliente`}
            size="2xl"
          >
            <div className="p-5">
              <CustomerForm
                initialForm={customer!}
                sendForm={update}
                text="Editar"
              />
            </div>
          </Drawer>
        )}
      </div>
    </DrawerProvider>
   </Protected>
  );
};
