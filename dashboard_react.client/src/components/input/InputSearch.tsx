import { Input } from "@nextui-org/input";
import React, { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ContainerSearch } from "../../containers/ContainerSearch";
import { LoadingComponent } from "../spinner/LoadingComponent";

interface InputSearchProps {
  handleSearchSubmit: (e: FormEvent) => void;
  handleSelect: (item: any) => void;
  setSearchInput: (value: string) => void;
  inputSearch: string;
  isLoading: boolean;
  data: any[];
  isForm?: boolean;
  required?: boolean;
  keyname?: string;
  keyid?: string;
  errorMessage?: string;
  label?: string;
  defaultValue?: string;
  createItemFn?: () => void;
}

const SearchResults = React.memo(
  ({
    data,
    isLoading,
    handleSelect,
    keyname,
    keyid,
    inputSearch,
    setOpen,
    createItemFn,
  }: any) => (
    <article className="absolute top-[4rem] z-50 flex w-full flex-col rounded-xl border border-gray-400 bg-white p-5 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
      <IoClose
        className="absolute right-3 top-2 cursor-pointer text-red-600"
        onClick={() => setOpen(false)}
        size={25}
      />
      <p className="whitespace-pre-line break-words font-bold">
        resultados de {inputSearch}...
      </p>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <ul className="max-h-[200px] min-h-[150px] overflow-y-auto">
          {data.map((item: any) => (
            <li
              key={item[keyid]}
              className="flex cursor-pointer justify-between py-2 hover:text-sky-800"
              onClick={() => {
                handleSelect(item);
                setOpen(false);
              }}
            >
              <p className="text-sm">{item[keyname]}</p>
              <p className="text-sm">{item[keyid].substring(0, 6)}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="cursor-pointer text-center font-bold text-cyan-500 hover:text-cyan-900" onClick={createItemFn}>
        ➕ Crear un nuevo item
      </p>
    </article>
  ),
);

export const InputSearch = ({
  handleSearchSubmit,
  handleSelect,
  inputSearch,
  isLoading,
  data,
  isForm = true,
  required = false,
  keyname = "name",
  keyid = "id",
  setSearchInput,
  errorMessage,
  label,
  defaultValue,
  createItemFn,
}: InputSearchProps) => {
  const [open, setOpen] = useState(false);

  const handleFocus = () => setOpen(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(e);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isForm) {
      event.preventDefault(); // Prevenir la acción por defecto (envío del formulario)
      handleSearchSubmit(event as unknown as FormEvent); // Llamar a la función de envío de búsqueda
    } else {
      handleFocus();
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <ContainerSearch
      isForm={isForm}
      submitFn={handleSubmit}
      className="flex flex-col sm:flex-row"
    >
      <div className="relative flex w-full px-2">
        <Input
          label={label}
          name="search"
          type="search"
          id="search"
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          autoFocus={false}
          isInvalid={!!errorMessage}
          isRequired={required}
          autoComplete="off"
          variant="underlined"
          value={inputSearch}
          onChange={(e) => setSearchInput(e.target.value)}
          errorMessage={errorMessage}
          defaultValue={defaultValue}
          endContent={
            <button className="focus:outline-none" type="button">
              <FaSearch />
            </button>
          }
        />
        {open && (
          <SearchResults
            data={data}
            isLoading={isLoading}
            handleSelect={handleSelect}
            keyname={keyname}
            keyid={keyid}
            inputSearch={inputSearch}
            setOpen={setOpen}
            createItemFn={createItemFn}
          />
        )}
      </div>
    </ContainerSearch>
  );
};
