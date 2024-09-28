import { Button } from "@nextui-org/button";
import { useEffect } from "react";

import { Col } from "../../../components/grid/Col";
import Protected from "../../../routes/middlewares/Protected";
import { Icon } from "../../../components/Icons/Icon";
import { CustomerAddressReponseColumns } from "../../../components/columns/CustomerAddressResponseColumns";
import { compactGrid } from "../../../theme/tableTheme";
import { CustomerAddressResponse } from "../../../types/CustomerAddressResponse";
import { getCustomerAddress } from "../../../services/customerAddressService";
import { useRetraseRender } from "../../../hooks/useRetraseRender";
import { Drawer } from "../../../containers/Drawer";
import { CustomerAddressForm } from "../../../components/forms/CustomerAddressForm";
import { useDrawer } from "../../../hooks/useDrawer";
import { useCustomerAddress } from "../../../hooks/useCustomerAddress";
import { useCustomerAddressStore } from "../../../store/useCustomerAddressStore";
import { QueryKeys } from "../../../config/contants";
import { TableServer } from "../../../components/table/TableServer";

import { initialCustomerAddress } from "./AddressCreatePage";

export const AddressPage = () => {
  const { create, update } = useCustomerAddress();
  const { reRender, render } = useRetraseRender();
  const { customerAddress, add, addressFilters, setAddressFilters } =
    useCustomerAddressStore();
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-person-plus"} /> Crear Dirección Cliente
          </Button>
        </Col>
        <TableServer<CustomerAddressResponse>
          columns={CustomerAddressReponseColumns}
          filters={addressFilters}
          hasFilters={true}
          queryFn={getCustomerAddress}
          queryKey={QueryKeys.CustomerDirections}
          setFilters={setAddressFilters}
          styles={compactGrid}
          text="de las direcciones"
          title={"Direcciones Cliente"}
          width={false}
        />
        {render && (
          <Drawer
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            size="2xl"
            title={`Crear Direccion Cliente`}
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
            size="xl"
            title={`Editar Cliente`}
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
