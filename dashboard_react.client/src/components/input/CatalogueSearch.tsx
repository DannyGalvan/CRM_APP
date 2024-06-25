import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalType } from "../../hooks/useModalStrategies";
import { getAllCatalogues } from "../../services/catalogueService";
import { useModalCreateStore } from "../../store/useModalCreateStore";
import { toCamelCase } from "../../util/converted";
import { ApiError } from "../../util/errors";
import { InputSearch } from "./InputSearch";

interface CatalogueSearchProps {
  querykey: ModalType;
  entity: string;
  errorMessage?: string;
  setFormValue: (id: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  defaultValue?: string;
  queryFn?: (filter?: string) => Promise<any>;
  keyName?: string;
  isForm?: boolean;
  required?: boolean;
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
  isForm = true,
  required = true,
}: CatalogueSearchProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const {open} = useModalCreateStore();

  const { data, isPending, error } = useQuery<any, ApiError>({
    queryKey: [querykey, "search", search],
    queryFn: () =>
      queryFn
        ? queryFn(`${keyName}:like:${search}`)
        : getAllCatalogues(querykey, `Description:like:${search}`),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelect = (selected: any) => {
    setSearch(selected[toCamelCase(keyName)]);
    isForm ? setFormValue({
      target: {
        name: name,
        value: selected.id,
      },
    } as any) : setFormValue(selected);
  };

  useEffect(() => {
    if (defaultValue) {
      setSearch(defaultValue);
    }
  }, [defaultValue]);

  if (error) {
    navigate("/error", {
      state: {
        statuaCode: error.statusCode,
        message: error.message,
        name: error.name,
      },
    });
  }

  return (
    <div>
      <InputSearch
        data={data?.data || []}
        isLoading={isPending}
        inputSearch={search}
        handleSearchSubmit={handleSearchSubmit}
        handleSelect={handleSelect}
        setSearchInput={setSearch}
        errorMessage={errorMessage}
        label={entity}
        required={required}
        isForm={false}
        defaultValue={defaultValue}
        keyname={toCamelCase(keyName)}
        createItemFn={()=>open(querykey, `Crear ${entity}`)}
      />
    </div>
  );
};
