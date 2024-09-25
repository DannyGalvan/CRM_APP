import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ModalType } from "../../hooks/useModalStrategies";
import { getAllCatalogues } from "../../services/catalogueService";
import { useModalCreateStore } from "../../store/useModalCreateStore";
import { toCamelCase } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { InputSearch } from "./InputSearch";
import { useErrorsStore } from "../../store/useErrorsStore";
import { onSearchUpdate } from "../../obsevables/searchObservable";
interface CatalogueSearchProps {
  querykey: ModalType;
  entity: string;
  errorMessage?: string;
  setFormValue: (id: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  defaultValue?: string;
  queryFn?: (filter?: string) => Promise<any>;
  keyName?: string;
  keyAdd?: string;
  aditionalFilter?: string;
  isForm?: boolean;
  required?: boolean;
  disabled?: boolean;
  selector?: (state: any) => any;
  unSelector?: () => void;
}

export const CatalogueSearch = ({
  querykey,
  entity,
  errorMessage,
  setFormValue,
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
  keyAdd
}: CatalogueSearchProps) => {
  const { setError } = useErrorsStore();
  const [search, setSearch] = useState<string>("");
  const { open } = useModalCreateStore();

  const { data, isPending, error } = useQuery<any, ApiError>({
    queryKey: [querykey, "search", search, aditionalFilter],
    queryFn: () =>
      queryFn
        ? queryFn(`${keyName}:like:${search} ${aditionalFilter}`)
        : getAllCatalogues(
            querykey,
            `Description:like:${search} ${aditionalFilter}`,
          ),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelect = (selected: any) => {
    setSearch(selected[toCamelCase(keyName)]);
    isForm
      ? setFormValue({
          target: {
            name: name,
            value: selected.id,
          },
        } as any)
      : setFormValue(selected);

    selector && selector(selected);
  };

  const handleUnselect = () => {
    setSearch("");
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
        data={data?.data || []}
        isLoading={isPending}
        inputSearch={search}
        handleSearchSubmit={handleSearchSubmit}
        handleSelect={handleSelect}
        handleUnSelect={handleUnselect}
        setSearchInput={setSearch}
        errorMessage={errorMessage}
        label={entity}
        required={required}
        disabled={disabled}
        isForm={false}
        defaultValue={defaultValue}
        keyname={toCamelCase(keyName)}
        entity={entity}
        createItemFn={() => open(querykey, entity)}
        keyAdd={keyAdd}
      />
    </div>
  );
};
