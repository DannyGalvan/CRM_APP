import { EventApi } from "@fullcalendar/core/index.js";
import { ScrollShadow, Switch } from "@nextui-org/react";
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
    <ScrollShadow className="h-[92vh] w-[300px]">
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2 className="m-0 text-xl">Funcionamiento</h2>
          <ul className="m-0 ps-6">
            <li className="mx-0 my-6 p-0">
              Seleccione fechas y se le pedirá que cree un nuevo evento.
            </li>
            <li className="mx-0 my-6 p-0">
              Arrastrar, soltar, cambiar tamaño a los eventos
            </li>
            <li className="mx-0 my-6 p-0">
              Click a un evento para modificarlo
            </li>
          </ul>
        </div>
        <div className="demo-app-sidebar-section">
          <Switch
            isSelected={weekendsVisible}
            onChange={handleWeekendsToggle}
            color="secondary"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Icon name={`bi bi-eye-fill ${className}`}  />
                
              ) : (
                <Icon name={`bi bi-eye-slash-fill ${className}`}  />
              )
            }
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
