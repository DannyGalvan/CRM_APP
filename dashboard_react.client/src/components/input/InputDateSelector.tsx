import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/date-picker";
import { I18nProvider } from "@react-aria/i18n";

import { useRangeOfDatesStore } from "../../store/useRangeOfDatesStore";

interface InputDateSelectorProps {
  label: string;
}

export const InputDateSelector = ({ label }: InputDateSelectorProps) => {
  const { setRageOfDates, end, start } = useRangeOfDatesStore();

  return (
    <I18nProvider locale="es-Ca">
      <DateRangePicker
        className="max-w-xs"
        defaultValue={{
          start: parseDate(start),
          end: parseDate(end),
        }}
        label={label}
        showMonthAndYearPickers={true}
        onChange={(date) => {
          setRageOfDates({
            start: date.start.toString(),
            end: date.end.toString(),
          });
        }}
      />
    </I18nProvider>
  );
};
