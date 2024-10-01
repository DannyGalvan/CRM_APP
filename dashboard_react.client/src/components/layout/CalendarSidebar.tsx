import { EventApi } from "@fullcalendar/core/index.js";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Switch } from "@nextui-org/switch";

import { Icon } from "../Icons/Icon";
import { EventSidebar } from "../calendar/EventSidebar";

interface CalendarSidebarProps {
  weekendsVisible: boolean;
  handleWeekendsToggle: () => void;
  currentEvents: EventApi[];
}

export const CalendarSidebar = ({
  weekendsVisible,
  handleWeekendsToggle,
  currentEvents,
}: CalendarSidebarProps) => {
  return (
    <ScrollShadow className="main-content">
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2 className="m-0 text-xl">Funcionamiento</h2>
          <ul className="m-0 ps-6">
            <li className="p-0 my-6 mx-0">
              Seleccione fechas y se le pedirá que cree un nuevo evento.
            </li>
            <li className="p-0 my-6 mx-0">
              Arrastrar, soltar, cambiar tamaño a los eventos
            </li>
            <li className="p-0 my-6 mx-0">
              Click a un evento para modificarlo
            </li>
          </ul>
        </div>
        <div className="demo-app-sidebar-section">
          <Switch
            color="secondary"
            isSelected={weekendsVisible}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Icon name={`bi bi-eye-fill ${className}`} />
              ) : (
                <Icon name={`bi bi-eye-slash-fill ${className}`} />
              )
            }
            onChange={handleWeekendsToggle}
          >
            Fines de semana
          </Switch>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>Todos los eventos ({currentEvents.length})</h2>
          <ul className="m-0 ps-6">{currentEvents.map(EventSidebar)}</ul>
        </div>
      </div>
    </ScrollShadow>
  );
};
