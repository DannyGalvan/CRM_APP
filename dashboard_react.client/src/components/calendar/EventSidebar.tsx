import { EventApi, formatDate } from "@fullcalendar/core/index.js";

export const EventSidebar = (event: EventApi) => {
  return (
    <li className="mx-0 my-6 p-0" key={event.id}>
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
