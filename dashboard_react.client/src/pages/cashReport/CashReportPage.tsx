import { Button } from "@nextui-org/button";
import { useEffect } from "react";

import { Icon } from "../../components/Icons/Icon";
import { CashReportResponseColumns } from "../../components/columns/CashReportResponseColumns";
import { CashReportForm } from "../../components/forms/CashReportForm";
import { Col } from "../../components/grid/Col";
import { TableServer } from "../../components/table/TableServer";
import { QueryKeys } from "../../config/contants";
import { Drawer } from "../../containers/Drawer";
import { useCashReport } from "../../hooks/useCashReport";
import { useDrawer } from "../../hooks/useDrawer";
import { useRetraseRender } from "../../hooks/useRetraseRender";
import Protected from "../../routes/middlewares/Protected";
import { getCashReports } from "../../services/cashReportService";
import { useCashReportStore } from "../../store/useCashReportStore";
import { compactGrid } from "../../theme/tableTheme";
import { CashReportRequest } from "../../types/CashReportRequest";
import { CashReportResponse } from "../../types/CashReportResponse";

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
        <Col className="flex justify-end mt-5">
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
                initialForm={cashReport as CashReportRequest}
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
