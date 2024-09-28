import { create } from "zustand";

import { DateFilters } from "../services/orderService";
import { minDateMaxDate } from "../util/converted";

interface RangeOfDateState {
  start: string;
  end: string;
  setRageOfDates: ({ start, end }: DateFilters) => void;
  getDateFilters: (fieldName: string) => string;
}

const dateRange = minDateMaxDate(1);

export const useRangeOfDatesStore = create<RangeOfDateState>((set, get) => ({
  start: dateRange.minDate,
  end: dateRange.maxDate,
  setRageOfDates: ({ start, end }) => {
    set({ start, end });
  },
  getDateFilters: (fieldName) => {
    const dateString = `${fieldName}:gt:${get().start}T00 AND ${fieldName}:lt:${get().end}T23`;
    return dateString;
  },
}));
