import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useModalStrategies } from "../../hooks/useModalStrategies";
import { useModalCreateStore } from "../../store/useModalCreateStore";

export const ModalCreateItem = () => {
  const { close, modal } = useModalCreateStore();
  const { openCreate } = useModalStrategies();

  return (
    <Modal isOpen={modal.isOpen} onClose={close} size="3xl">
      <ModalContent>
        <ModalHeader>{modal.title}</ModalHeader>
        <ModalBody className="max-h-[80vh] overflow-y-auto">
          {openCreate()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            variant="light"
            onPress={close}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
