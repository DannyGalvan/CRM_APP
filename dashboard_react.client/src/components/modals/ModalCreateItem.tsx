import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { useModalStrategies } from "../../hooks/useModalStrategies";
import { useModalCreateStore } from "../../store/useModalCreateStore";

export const ModalCreateItem = () => {
  const { close, modal } = useModalCreateStore();
  const { openCreate } = useModalStrategies();

  return (
    <Modal isOpen={modal.isOpen} size="3xl" onClose={close}>
      <ModalContent>
        <ModalHeader>{modal.title}</ModalHeader>
        <ModalBody className="overflow-y-auto max-h-80vh">
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
