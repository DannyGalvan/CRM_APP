import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { TableColumn } from "react-data-table-component";
import { Icon } from "../Icons/Icon";

interface ModalTableProps {
  columns: TableColumn<any>[];
  changeVisibilitiColumn: (column: TableColumn<any>) => void;
  open: boolean;
  toggle: () => void;
}

export const ModalTable = ({
  columns,
  changeVisibilitiColumn,
  open,
  toggle,
}: ModalTableProps) => {
  
  
  return (
    <Modal isOpen={open} size="3xl" onClose={toggle}>
      <ModalContent>
        <ModalHeader>Campos Visibles</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4 p-6">
            {columns.map((column, index) => (
              <div key={index}>
                <Switch
                  isSelected={!column.omit}
                  onChange={() => changeVisibilitiColumn(column)}
                  color="primary"
                  thumbIcon={({ isSelected, className }) =>
                    isSelected ? (
                      <Icon name={`bi bi-eye-fill ${className}`} />
                    ) : (
                      <Icon name={`bi bi-eye-slash-fill ${className}`} />
                    )
                  }
                >
                  {column.name}
                </Switch>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
