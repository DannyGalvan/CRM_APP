import { Input } from "@nextui-org/input";
import React, { FormEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { ContainerSearch } from "../../containers/ContainerSearch";
import { SearchCatalogue } from "../../types/Catalogue";
import { SearchResults } from "../layout/SearchResults";

interface InputSearchProps<T> {
  handleSearchSubmit: (e: FormEvent) => void;
  handleSelect: (item: T) => void;
  handleUnSelect?: () => void;
  setSearchInput: (value: string) => void;
  inputSearch: string;
  isLoading: boolean;
  data: T[];
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

export const InputSearch = <T extends SearchCatalogue>({
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
}: InputSearchProps<T>) => {
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
      <div className="flex relative px-2 w-full">
        <Input
          autoComplete="off"
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
