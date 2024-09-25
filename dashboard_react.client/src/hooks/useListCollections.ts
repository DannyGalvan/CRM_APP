import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_CATALOGUE, QueryKeys } from '../config/contants';
import { getCollections } from '../services/collectionService';
import { ApiResponse } from '../types/ApiResponse';
import { CollectionResponse } from '../types/CollectionResponse';
import { ApiError } from '../util/errors';

export interface SelectedCatalogue {
  selected?: string;
  name?: string;
}

export const useListCollections = () => {
  const [selectedCatalogue, setSetselectedCatalogue] =
    useState<SelectedCatalogue>({
      selected: "",
      name: DEFAULT_CATALOGUE,
    });

  const {
    data: collections,
    error: collectionError,
    isLoading: collectionLoading,
    isFetching: collectionFetching,
  } = useQuery<ApiResponse<CollectionResponse[]>, ApiError>({
    queryKey: [QueryKeys.Collections],
    queryFn: getCollections,
    select: (data) => ({
      ...data,
      data: data?.data?.filter((collection) => collection.isVisible) ?? [],
    }),
  });

  const handleSelect = useCallback((e: any) => {
    setSetselectedCatalogue(JSON.parse(e.target.value));
  }, []);
  
  const filteredCollections = useMemo(
    () => collections?.data ?? [],
    [collections],
  );

  return {
    selectedCatalogue,
    collections: filteredCollections,
    collectionError,
    collectionLoading,
    collectionFetching,
    handleSelect,
  };
}
