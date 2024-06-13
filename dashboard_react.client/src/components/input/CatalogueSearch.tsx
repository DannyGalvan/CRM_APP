import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCatalogues } from "../../services/catalogueService";
import { ApiError } from "../../util/errors";
import { InputSearch } from "./InputSearch";

interface CatalogueSearchProps {
  querykey: string;
  entity: string;
  errorMessage?: string;
  setFormValue: (id: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  defaultValue?: string;
}

export const CatalogueSearch = ({
  querykey,
  entity,
  errorMessage,
  setFormValue,
  name,
  defaultValue,
}: CatalogueSearchProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const { data, isPending, error } = useQuery<any, ApiError>({
    queryKey: [querykey, "search", search],
    queryFn: () => getAllCatalogues(querykey, `Description:like:${search}`),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelect = (selected: any) => {
    setSearch(selected.name);
    setFormValue({
      target: {
        name: name,
        value: selected.id,
      },
    } as any);
  };

  useEffect(() => {
    if (defaultValue) {
      setSearch(defaultValue);
    }
  }, [defaultValue])

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
        required
        isForm={false}
        defaultValue={defaultValue}
      />
    </div>
  );
};
