import {
  DateSelectArg,
  EventApi,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // a plugin!
import listPlugin from "@fullcalendar/list"; // a plugin!
import multimonth from "@fullcalendar/multimonth"; // a plugin!
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import { useCallback, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

import { CalendarSidebar } from "../../components/layout/CalendarSidebar";
import { ModalCalendar } from "../../components/modals/ModalCalendar";
import { api } from "../../config/axios/interceptors";
import { useDates } from "../../hooks/useDates";
import { useToggle } from "../../hooks/useToggle";
import Protected from "../../routes/middlewares/Protected";
import { partialUpdateEvent } from "../../services/eventService";
import "../../styles/calendar.css";
import { ApiError } from "../../util/errors";
import { NotFound } from "../error/NotFound";

export function Component() {
  const [weekendsVisible, setWeekendsVisible] = useState(
    localStorage.getItem("visible") === "true",
  );
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [selectEvent, setSelectEvent] = useState<EventInput>();
  const calendar = useRef<FullCalendar | null>(null);
  const { open, toggle } = useToggle();
  const { open: openEvent, toggle: toggleEvent } = useToggle();
  const { date, handleDate } = useDates();
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const isPhone = useMediaQuery({ query: "(max-width: 1150px)" });

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectEvent(clickInfo.event.toPlainObject());
    toggleEvent();
  };

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
    localStorage.setItem("visible", String(!weekendsVisible));
  };

  const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    toggle();
    handleDate(selectInfo.startStr, selectInfo.endStr);
  };

  const eventChange = async (event: EventChangeArg) => {
    const response = await partialUpdateEvent(event.event.toPlainObject());

    response.success
      ? toast("Evento actualizado correctamente", { type: "success" })
      : toast(response.message, { type: "error" });
  };

  const events = useCallback(
    async (info: any, successCallback: any, failureCallback: any) => {
      let data: EventApi[] = [];
      try {
        const response = api.get<any, EventApi[], any>(
          `event?start=${info.start.toISOString()}&end=${info.end.toISOString()}`,
        );
        data = await response;
        successCallback(data);
      } catch (error) {
        setError(error as ApiError);
        failureCallback(data);
      }
    },
    [],
  );

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <Protected>
      <ModalCalendar
        datesSelect={date}
        element={calendar}
        isOpen={open}
        title="Nuevo Evento"
        onClose={toggle}
      />
      <ModalCalendar
        datesSelect={date}
        element={calendar}
        event={selectEvent}
        isOpen={openEvent}
        title={"Editar Evento"}
        onClose={toggleEvent}
      />
      <div className="demo-app">
        {isPhone ? null : (
          <CalendarSidebar
            currentEvents={currentEvents}
            handleWeekendsToggle={handleWeekendsToggle}
            weekendsVisible={weekendsVisible}
          />
        )}
        <FullCalendar
          ref={calendar}
          businessHours={true}
          buttonText={{
            day: "Día",
            month: "Mes",
            week: "Semana",
            today: "Hoy",
            list: "Lista",
          }}
          dayMaxEvents={true}
          editable={true}
          eventChange={eventChange}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          events={events}
          eventsSet={handleEvents}
          headerToolbar={{
            left: isPhone ? "prev next" : "prevYear prev next nextYear today",
            center: !isPhone ? "title" : "today",
            right: isPhone
              ? "dayGridMonth timeGridDay"
              : "dayGridMonth timeGridWeek timeGridDay listMonth",
          }}
          initialView="dayGridMonth"
          locale={"es"}
          navLinks={true}
          noEventsText="No hay eventos para mostrar"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            multimonth,
            interactionPlugin,
          ]}
          select={handleDateSelect}
          selectMirror={true}
          selectable={true}
          stickyHeaderDates={true}
          weekends={weekendsVisible}
        />
      </div>
    </Protected>
  );
}

Component.displayName = "CalendarPage";
