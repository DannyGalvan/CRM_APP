import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";

import { useCashReport } from "../../hooks/useCashReport";
import { useDrawer } from "../../hooks/useDrawer";
import { downloadFile } from "../../services/reportService";
import { useCashReportStore } from "../../store/useCashReportStore";
import { useErrorsStore } from "../../store/useErrorsStore";
import { CashReportResponse } from "../../types/CashReportResponse";
import { copyToClipboard } from "../../util/converted";
import { Icon } from "../Icons/Icon";

interface CashReportActionMenuProps {
  data: CashReportResponse;
}

export const CashReportActionMenu = ({ data }: CashReportActionMenuProps) => {
  const [load, setLoad] = useState(false);
  const { setOpenUpdate } = useDrawer();
  const { setError } = useErrorsStore();
  const { getDetailsByCashReportId, addCashReport } = useCashReportStore();
  const { deleteCashReport } = useCashReport();

  const handleOpen = async () => {
    data.createdAt = null;
    data.updatedAt = null;
    data.updatedBy = null;
    data.createdBy = null;
    setOpenUpdate();

    addCashReport(data);

    await getDetailsByCashReportId(data.id, setError);
  };

  const handleDelete = async () => {
    await deleteCashReport(data.id);
  };

  const handlePrint = async () => {
    setLoad(true);
    await downloadFile(`/CashReport?id=${data.id}`, `reporte_${data.id}.pdf`);
    setLoad(false);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly className="bg-transparent text-cyan-500">
          <Icon name="bi bi-three-dots-vertical" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="copy"
          startContent={<Icon name="bi bi-clipboard-check" />}
          onClick={() => copyToClipboard(data.id)}
        >
          Copiar
        </DropdownItem>
        <DropdownItem
          key="edit"
          className="text-success"
          color="success"
          startContent={<Icon name="bi bi-pen" />}
          onClick={handleOpen}
        >
          Editar
        </DropdownItem>
        <DropdownItem
          key="print"
          className="text-primary"
          color="primary"
          startContent={<Icon name="bi bi-printer" />}
          onClick={handlePrint}
        >
          Ver Reporte {load && <Spinner color="warning" size="sm" />}
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          content="Eliminar"
          startContent={<Icon name="bi bi-trash3" />}
          onClick={handleDelete}
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
