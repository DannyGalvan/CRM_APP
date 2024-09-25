import { Button } from "@nextui-org/button";
import { Col } from "../../../components/grid/Col";
import Protected from "../../../routes/middlewares/Protected";
import { Icon } from "../../../components/Icons/Icon";
import { TableRoot } from "../../../components/table/TableRoot";
import { CustomerAddressReponseColumns } from "../../../components/columns/CustomerAddressResponseColumns";
import { compactGrid } from "../../../theme/tableTheme";
import { ApiError } from "../../../util/errors";
import { ApiResponse } from "../../../types/ApiResponse";
import { CustomerAddressResponse } from "../../../types/CustomerAddressResponse";
import { ValidationFailure } from "../../../types/ValidationFailure";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAddress } from "../../../services/customerAddressService";
import { useEffect } from "react";
import { NotFound } from "../../error/NotFound";
import { useRetraseRender } from "../../../hooks/useRetraseRender";
import { Drawer } from "../../../containers/Drawer";
import { CustomerAddressForm } from "../../../components/forms/CustomerAddressForm";
import { initialCustomerAddress } from "./AddressCreatePage";
import { useDrawer } from "../../../hooks/useDrawer";
import { useCustomerAddress } from "../../../hooks/useCustomerAddress";
import { useCustomerAddressStore } from "../../../store/useCustomerAddressStore";
import { QueryKeys } from "../../../config/contants";

export const AddressPage = () => {
  const { create, update } = useCustomerAddress();
  const { reRender, render } = useRetraseRender();
  const { customerAddress, add } = useCustomerAddressStore();
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();

  const { data, error, isFetching, isLoading } = useQuery<
    ApiResponse<CustomerAddressResponse[] | ValidationFailure[]>,
    ApiError | undefined
  >({
    queryKey: [QueryKeys.CustomerDirections],
    queryFn: () => getCustomerAddress(),
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
            <Icon name={"bi bi-person-plus"} /> Crear Dirección Cliente
          </Button>
        </Col>
        <TableRoot
          columns={CustomerAddressReponseColumns}
          data={data?.data ?? []}
          hasFilters={true}
          pending={isLoading || isFetching}
          text="de las direcciones"
          styles={compactGrid}
          title={"Direcciones Cliente"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            title={`Crear Direccion Cliente`}
            size="2xl"
          >
            <div className="p-5">
              <CustomerAddressForm
                initialForm={initialCustomerAddress}
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
              <CustomerAddressForm
                initialForm={customerAddress!}
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
