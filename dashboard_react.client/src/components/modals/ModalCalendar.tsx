import { EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Switch } from "@nextui-org/switch";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { MutableRefObject } from "react";

import { useEvents } from "../../hooks/useEvents";
import { ErrorObject, useForm } from "../../hooks/useForm";
import { handleOneLevelZodError } from "../../util/converted";
import { eventSchema } from "../../util/validations/eventValidations";

interface ModalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  element: MutableRefObject<FullCalendar | null>;
  datesSelect: { start: string; end: string };
  event?: EventInput;
}

const initialEvent: EventInput = {
  allDay: false,
  title: "",
  start: "",
  end: "",
  description: "",
  time: "06:00",
};

const validateEvent = (event: EventInput) => {
  let errors: ErrorObject = {};

  const parce = eventSchema.safeParse(event);

  if (!parce.success) errors = handleOneLevelZodError(parce.error);

  return errors;
};

export const ModalCalendar = ({
  isOpen,
  onClose,
  title,
  element,
  datesSelect,
  event,
}: ModalCalendarProps) => {
  const { create, update, eliminate, eventUpdate } = useEvents({
    datesSelect,
    element,
    event,
    onClose,
  });

  const { form, errors, handleChange, loading, handleSubmit } = useForm(
    eventUpdate ?? initialEvent,
    validateEvent,
    !event ? create : update,
  );

  const close = () => {
    element.current?.getApi().unselect();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} size={"md"} onClose={close}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                errorMessage={errors?.title}
                isInvalid={!!errors?.title}
                label="Ingresa el nombre del evento"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
              <Input
                errorMessage={errors?.description}
                isInvalid={!!errors?.description}
                label="ingresa la descripcion del evento"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
              <Switch
                defaultSelected
                isSelected={form.allDay}
                name="allDay"
                size="sm"
                onChange={(e) => {
                  const target = {
                    target: { name: "allDay", value: e.target.checked },
                  };
                  handleChange(target as any);
                }}
              >
                Dura todo el día?
              </Switch>
              {!form.allDay && (
                <Input
                  isClearable
                  errorMessage={errors?.time}
                  isInvalid={!!errors?.time}
                  label="Hora evento"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                />
              )}
            </div>
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
            {eventUpdate && (
              <Button
                color="danger"
                type="button"
                variant="light"
                onPress={eliminate}
              >
                Eliminar
              </Button>
            )}
            <Button color="primary" isLoading={loading} type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
