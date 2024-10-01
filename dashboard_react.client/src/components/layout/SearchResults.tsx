/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IoClose } from "react-icons/io5";

import { SearchCatalogue } from "../../types/Catalogue";
import { LoadingComponent } from "../spinner/LoadingComponent";

export interface SearchResultsProps<T> {
  data: T[];
  isLoading: boolean;
  handleSelect: (item: T) => void;
  keyname: string;
  keyid: string;
  inputSearch: string;
  setOpen: (open: boolean) => void;
  createItemFn?: () => void;
  entity: string;
  keyAdd?: string;
}

export const SearchResults = <T extends SearchCatalogue>({
  data,
  isLoading,
  handleSelect,
  keyname,
  keyid,
  inputSearch,
  setOpen,
  createItemFn,
  entity,
  keyAdd,
}: SearchResultsProps<T>) => (
  <article className="flex absolute z-50 flex-col p-5 w-full bg-white rounded-xl border border-gray-400 top-[4rem] shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
    <IoClose
      className="absolute top-2 right-3 text-red-600 cursor-pointer"
      size={25}
      onClick={() => setOpen(false)}
    />
    <p className="font-bold whitespace-pre-line break-words">
      resultados de {inputSearch}...
    </p>
    {isLoading ? (
      <LoadingComponent />
    ) : (
      <ul className="overflow-y-auto max-h-[200px] min-h-[150px]">
        {data.map((item) => (
          <li
            key={item[keyid] as string}
            className="flex justify-between py-2 cursor-pointer hover:text-sky-800"
            onClick={() => {
              handleSelect(item);
              setOpen(false);
            }}
          >
            <p className="text-sm">{item[keyname] as string}</p>
            {keyAdd && <p className="text-sm">{item[keyAdd] as string}</p>}
          </li>
        ))}
      </ul>
    )}
    <p
      className="font-bold text-center cursor-pointer text-cyan-500 hover:text-cyan-900"
      onClick={createItemFn}
    >
      ➕ Crear nuevo {entity}
    </p>
  </article>
);
