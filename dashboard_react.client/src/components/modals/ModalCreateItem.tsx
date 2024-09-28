import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { useModalStrategies } from "../../hooks/useModalStrategies";
import { useModalCreateStore } from "../../store/useModalCreateStore";

export const ModalCreateItem = () => {
  const { close, modal } = useModalCreateStore();
  const { openCreate } = useModalStrategies();

  return (
    <Modal isOpen={modal.isOpen} size="3xl" onClose={close}>
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
