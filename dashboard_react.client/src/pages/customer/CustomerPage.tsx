import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { Col } from "@tremor/react";
import { lazy, Suspense, useEffect } from "react";
import { Icon } from "../../components/Icons/Icon";
import { CustomerForm } from "../../components/forms/CustomerForm";
import { TableRoot } from "../../components/table/TableRoot";
import { Drawer } from "../../containers/Drawer";
import { useCustomer } from "../../hooks/useCustomer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getCustomers } from "../../services/customerService";
import { useCustomerStore } from "../../store/useCustomerStore";
import { compactGrid } from "../../theme/tableTheme";
import { ApiResponse } from "../../types/ApiResponse";
import { CustomerResponse } from "../../types/CustomerResponse";
import { ValidationFailure } from "../../types/ValidationFailure";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";
import { initialCustomer } from "./CustomerCreatePage";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { useDrawer } from "../../hooks/useDrawer";
import { CustomerResponseColumns } from "../../components/columns/CustomerResponseColumns";

const ModalCreateItem = lazy(() =>
  import("../../components/modals/ModalCreateItem").then((module) => ({
    default: module.ModalCreateItem,
  })),
);

export const CustomerPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { customer, add } = useCustomerStore();
  const { create, update } = useCustomer();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<CustomerResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

  useEffect(() => {
    reRender();
  }, []);

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-person-plus"} /> Crear Cliente
          </Button>
        </Col>
        <TableRoot
          columns={CustomerResponseColumns}
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
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
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
              setOpenUpdate();
              add(null);
            }}
            title={`Editar Cliente`}
            size="xl"
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
      <Suspense fallback={<LoadingComponent />}>
        <ModalCreateItem />
      </Suspense>
    </Protected>
  );
};
