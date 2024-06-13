import { EventApi, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { MutableRefObject, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createEvent,
  partialUpdateEvent,
  updateEvent,
} from "../services/eventService";
import { ApiResponse } from "../types/ApiResponse";
import { toEventInput } from "../util/converted";

interface useEventsProps {
  onClose: () => void;
  element: MutableRefObject<FullCalendar | null>;
  event?: EventInput;
  datesSelect: { start: string; end: string };
}

export const useEvents = ({
  onClose,
  element,
  event,
  datesSelect,
}: useEventsProps) => {
  const [eventUpdate, setEventUpdate] = useState<EventInput | null>(null);

  useEffect(() => {
    setEventUpdate(toEventInput(event));
  }, [event]);

  const create = async (event: EventInput): Promise<ApiResponse<EventApi>> => {
    const newEvent: EventInput = {
      title: event.title,
      description: event.description,
      start: `${datesSelect.start}T${event.time}`,
      end: `${datesSelect.end}T${event.time}`,
      allDay: event.allDay,
    };

    const response = await createEvent(newEvent);

    if (response.success) {
      element.current?.getApi().addEvent(newEvent);
      element.current?.getApi().unselect();
      onClose();
      toast("Evento creado correctamente", { type: "success" });
    } else {
      toast(response.message, { type: "error" });
    }

    return response;
  };

  const update = async (
    eventObj: EventInput,
  ): Promise<ApiResponse<EventApi>> => {
    const newEvent: EventInput = {
      title: eventObj.title,
      description: eventObj.description,
      start: `${eventObj.start}T${eventObj?.time}`,
      end: `${eventObj.end}T${eventObj?.time}`,
      allDay: eventObj.allDay,
      id: eventUpdate?.id,
    };

    const response = await updateEvent(newEvent);

    if (response.success) {
      element.current?.getApi().getEventById(eventUpdate?.id!)?.remove();
      element.current?.getApi().addEvent(newEvent);
      element.current?.getApi().unselect();
      onClose();
      toast("Evento actualizado correctamente", { type: "success" });
    } else {
      toast(response.message, { type: "error" });
    }

    return response;
  };

  const eliminate = async () => {
    const newEvent: EventInput = {
      isActive: false,
      id: eventUpdate?.id,
    };

    const response = await partialUpdateEvent(newEvent);

    if (response.success) {
      element.current?.getApi().getEventById(eventUpdate?.id!)?.remove();
      element.current?.getApi().unselect();
      toast(`Evento ${eventUpdate?.title} eliminado correctamente`, {
        type: "success",
      });
      onClose();
    }else{
      toast(response.message, { type: "error" });
    }

    return response;
  };

  return {
    eventUpdate,
    create,
    update,
    eliminate,
  };
};
