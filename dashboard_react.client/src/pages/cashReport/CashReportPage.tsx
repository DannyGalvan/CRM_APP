import { useEffect } from "react";
import { Button } from "@nextui-org/button";

import { useCashReport } from "../../hooks/useCashReport";
import { useDrawer } from "../../hooks/useDrawer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import { CashReportResponse } from "../../types/CashReportResponse";
import { getCashReports } from "../../services/cashReportService";
import Protected from "../../routes/middlewares/Protected";
import { Col } from "../../components/grid/Col";
import { Icon } from "../../components/Icons/Icon";
import { compactGrid } from "../../theme/tableTheme";
import { CashReportResponseColumns } from "../../components/columns/CashReportResponseColumns";
import { Drawer } from "../../containers/Drawer";
import { CashReportForm } from "../../components/forms/CashReportForm";
import { QueryKeys } from "../../config/contants";
import { TableServer } from "../../components/table/TableServer";
import { useCashReportStore } from "../../store/useCashReportStore";

import { initialCashReport } from "./CreateCashReportPage";

export const CashReportPage = () => {
  const { openCreate, openUpdate, setOpenCreate, setOpenUpdate } = useDrawer();
  const { reRender, render } = useRetraseRender();
  const { create, update } = useCashReport();
  const { cashReport, addCashReport, cashFilters, setCashFilters } =
    useCashReportStore();

  useEffect(() => {
    reRender();
  }, []);

  return (
    <Protected>
      <div className="mt-20 md:mt-0">
        <Col className="mt-5 flex justify-end">
          <Button color={"secondary"} onClick={setOpenCreate}>
            <Icon name={"bi bi-bag-plus"} /> Crear Corte de Caja
          </Button>
        </Col>
        <TableServer<CashReportResponse>
          hasRangeOfDates
          columns={CashReportResponseColumns}
          fieldRangeOfDates="CreatedAt"
          filters={cashFilters}
          hasFilters={true}
          queryFn={getCashReports}
          queryKey={QueryKeys.CashReports}
          setFilters={setCashFilters}
          styles={compactGrid}
          text="de los cortes de caja"
          title={"Cortes de Caja"}
          width={false}
        />
        {render && (
          <Drawer
            id="create"
            isOpen={openCreate}
            setIsOpen={setOpenCreate}
            size="2xl"
            title={`Crear Corte de Caja`}
          >
            <div className="p-5">
              <CashReportForm
                reboot
                initialForm={initialCashReport}
                sendForm={create}
                text="Crear"
              />
            </div>
          </Drawer>
        )}
        {render && (
          <Drawer
            id="update"
            isOpen={openUpdate}
            setIsOpen={() => {
              setOpenUpdate();
              addCashReport(null);
            }}
            size="2xl"
            title={`Editar Corte de Caja`}
          >
            <div className="p-5">
              <CashReportForm
                initialForm={cashReport!}
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
