import { Button } from "@nextui-org/button";
import { Col } from "@tremor/react";
import { useEffect } from "react";

import { Icon } from "../../components/Icons/Icon";
import { CustomerForm } from "../../components/forms/CustomerForm";
import { Drawer } from "../../containers/Drawer";
import { useCustomer } from "../../hooks/useCustomer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getCustomers } from "../../services/customerService";
import { useCustomerStore } from "../../store/useCustomerStore";
import { compactGrid } from "../../theme/tableTheme";
import { CustomerResponse } from "../../types/CustomerResponse";
import { useDrawer } from "../../hooks/useDrawer";
import { CustomerResponseColumns } from "../../components/columns/CustomerResponseColumns";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";

import { initialCustomer } from "./CustomerCreatePage";

export const CustomerPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { customer, add, customerFilters, setCustomeFilters } =
    useCustomerStore();
  const { create, update } = useCustomer();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-person-plus"} /> Crear Cliente
          </Button>
        </Col>
        <TableServer<CustomerResponse>
          columns={CustomerResponseColumns}
          filters={customerFilters}
          hasFilters={true}
          queryFn={getCustomers}
          queryKey={QueryKeys.Customers}
          setFilters={setCustomeFilters}
          styles={compactGrid}
          text="de los clientes"
          title={"Clientes"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            size="2xl"
            title={`Crear Cliente`}
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
              setOpenUpdate();
              add(null);
            }}
            size="xl"
            title={`Editar Cliente`}
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
    </Protected>
  );
};
