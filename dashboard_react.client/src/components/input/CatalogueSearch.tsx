import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";

import { ModalType } from "../../hooks/useModalStrategies";
import { onSearchUpdate } from "../../obsevables/searchObservable";
import { getAllCatalogues } from "../../services/catalogueService";
import { useErrorsStore } from "../../store/useErrorsStore";
import { useModalCreateStore } from "../../store/useModalCreateStore";
import { ApiResponse } from "../../types/ApiResponse";
import { SearchCatalogue } from "../../types/Catalogue";
import { toCamelCase } from "../../util/converted";
import { ApiError } from "../../util/errors";

import { InputSearch } from "./InputSearch";
interface CatalogueSearchProps<T> {
  querykey: ModalType;
  entity: string;
  errorMessage?: string;
  setFormValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue?: (selected: T) => void;
  name: string;
  defaultValue?: string;
  queryFn?: (
    filter: string,
    page?: number,
    pageSize?: number,
  ) => Promise<ApiResponse<T[]>>;
  keyName?: string;
  keyAdd?: string;
  aditionalFilter?: string;
  isForm?: boolean;
  required?: boolean;
  disabled?: boolean;
  selector?: (state: T) => void;
  unSelector?: () => void;
}

export const CatalogueSearch = <T extends SearchCatalogue>({
  querykey,
  entity,
  errorMessage,
  setFormValue,
  setValue,
  name,
  defaultValue,
  queryFn,
  keyName = "name",
  aditionalFilter = "",
  isForm = true,
  required = true,
  disabled = false,
  selector,
  unSelector,
  keyAdd,
}: CatalogueSearchProps<T>) => {
  const { setError } = useErrorsStore();
  const [search, setSearch] = useState<string>("");
  const { open } = useModalCreateStore();

  const { data, isPending, error } = useQuery<ApiResponse<T[]>, ApiError>({
    queryKey: [querykey, "search", search, aditionalFilter, queryFn, keyName],
    queryFn: () =>
      queryFn
        ? queryFn(`${keyName}:like:${search}${aditionalFilter}`)
        : getAllCatalogues(
            querykey,
            `Description:like:${search} ${aditionalFilter}`,
          ),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelect = (selected: T) => {
    setSearch(selected[toCamelCase(keyName)] as string);
    if (isForm) {
      // Si es un formulario, maneja el ChangeEvent
      setFormValue &&
        setFormValue({
          target: {
            name: name,
            value: selected.id,
          },
        } as any); // Aquí utilizas un ChangeEvent simulado
    } else {
      // Si no es un formulario, pasa directamente el objeto seleccionado
      setValue && setValue(selected);
    }
    selector && selector(selected);
  };

  const handleUnselect = () => {
    setSearch("");
    setFormValue &&
      setFormValue({
        target: {
          name: name,
          value: "",
        },
      } as any);
    unSelector && unSelector();
  };

  useEffect(() => {
    if (defaultValue) {
      setSearch(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (error) {
      setError({
        statusCode: error.statusCode,
        message: error.message,
        name: error.name,
      });
    }
  }, [error, setError]);

  useEffect(() => {
    const subscription = onSearchUpdate(querykey).subscribe((event) => {
      setSearch(event.value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <InputSearch
        createItemFn={() => open(querykey, entity)}
        data={data?.data || []}
        defaultValue={defaultValue}
        disabled={disabled}
        entity={entity}
        errorMessage={errorMessage}
        handleSearchSubmit={handleSearchSubmit}
        handleSelect={handleSelect}
        handleUnSelect={handleUnselect}
        inputSearch={search}
        isForm={false}
        isLoading={isPending}
        keyAdd={keyAdd}
        keyname={toCamelCase(keyName)}
        label={entity}
        required={required}
        setSearchInput={setSearch}
      />
    </div>
  );
};
