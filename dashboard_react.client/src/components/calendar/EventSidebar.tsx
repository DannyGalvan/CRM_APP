import { EventApi, formatDate } from "@fullcalendar/core/index.js";

export const EventSidebar = (event: EventApi) => {
  return (
    <li key={event.id} className="p-0 my-6 mx-0">
      <b className="mr-1">
        {formatDate(event.start!, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
};
