import { DateRangePicker } from "@nextui-org/date-picker";
import { I18nProvider } from "@react-aria/i18n";

import { useRangeOfDatesStore } from "../../store/useRangeOfDatesStore";

interface InputDateSelectorProps {
  label: string;
}

export const InputDateSelector = ({ label }: InputDateSelectorProps) => {
  const { setRageOfDates, calendarDate, setCalendarDate } =
    useRangeOfDatesStore();

  return (
    <I18nProvider locale="es-Ca">
      <DateRangePicker
        className="max-w-xs"
        defaultValue={calendarDate}
        label={label}
        showMonthAndYearPickers={true}
        onChange={(date) => {
          setRageOfDates({
            start: date.start.toString(),
            end: date.end.toString(),
          });

          setCalendarDate(date);
        }}
      />
    </I18nProvider>
  );
};
