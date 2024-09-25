import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

const searchSubject = new Subject<{ key: string; value: string }>();

export const updateSearch = (key: string, newSearch: string) => {
  searchSubject.next({ key, value: newSearch });
};

export const onSearchUpdate = (key: string) =>
  searchSubject.asObservable().pipe(filter((event) => event.key === key));
