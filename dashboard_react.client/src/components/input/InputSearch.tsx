import { Input } from "@nextui-org/input";
import React, { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { ContainerSearch } from "../../containers/ContainerSearch";
import { LoadingComponent } from "../spinner/LoadingComponent";

interface InputSearchProps {
  handleSearchSubmit: (e: FormEvent) => void;
  handleSelect: (item: any) => void;
  handleUnSelect?: () => void;
  setSearchInput: (value: string) => void;
  inputSearch: string;
  isLoading: boolean;
  data: any[];
  isForm?: boolean;
  required?: boolean;
  disabled?: boolean;
  keyname?: string;
  keyAdd?: string;
  keyid?: string;
  errorMessage?: string;
  label?: string;
  defaultValue?: string;
  createItemFn?: () => void;
  entity: string;
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
    entity,
    keyAdd,
  }: any) => (
    <article className="absolute top-[4rem] z-50 flex w-full flex-col rounded-xl border border-gray-400 bg-white p-5 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
      <IoClose
        className="absolute top-2 right-3 text-red-600 cursor-pointer"
        size={25}
        onClick={() => setOpen(false)}
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
              {keyAdd && <p className="text-sm">{item[keyAdd]}</p>}
            </li>
          ))}
        </ul>
      )}
      <p
        className="cursor-pointer text-center font-bold text-cyan-500 hover:text-cyan-900"
        onClick={createItemFn}
      >
        ➕ Crear nuevo {entity}
      </p>
    </article>
  ),
);

export const InputSearch = ({
  handleSearchSubmit,
  handleSelect,
  handleUnSelect,
  inputSearch,
  isLoading,
  data,
  isForm = true,
  required = false,
  disabled = false,
  keyname = "name",
  keyid = "id",
  setSearchInput,
  errorMessage,
  label,
  defaultValue,
  createItemFn,
  entity,
  keyAdd,
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
      handleUnSelect && handleUnSelect();
    }

    if (event.key === "Tab") {
      data && handleSelect(data[0]);
      setOpen(false);
    }
  };

  return (
    <ContainerSearch
      className="flex flex-col sm:flex-row"
      isForm={isForm}
      submitFn={handleSubmit}
    >
      <div className="relative flex w-full px-2">
        <Input
          autoComplete="off"
          autoFocus={false}
          defaultValue={defaultValue}
          disabled={disabled}
          endContent={
            <button className="focus:outline-none" type="button">
              <FaSearch />
            </button>
          }
          errorMessage={errorMessage}
          id="search"
          isInvalid={!!errorMessage}
          isRequired={required}
          label={label}
          name="search"
          type="search"
          value={inputSearch}
          variant="underlined"
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyPress}
        />
        {open && (
          <SearchResults
            createItemFn={createItemFn}
            data={data}
            entity={entity}
            handleSelect={handleSelect}
            inputSearch={inputSearch}
            isLoading={isLoading}
            keyAdd={keyAdd}
            keyid={keyid}
            keyname={keyname}
            setOpen={setOpen}
          />
        )}
      </div>
    </ContainerSearch>
  );
};
