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
        label={label}
        defaultValue={{
          start: parseDate(start),
          end: parseDate(end),
        }}
        className="max-w-xs"
        onChange={(date) => {
          setRageOfDates({
            start: date.start.toString(),
            end: date.end.toString(),
          });
        }}
        showMonthAndYearPickers={true}
      />
    </I18nProvider>
  );
};
