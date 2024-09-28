import { Select, SelectItem } from "@nextui-org/select";

import { CollectionResponse } from "../../types/CollectionResponse";

export interface CollectionSelectProps {
  isLoading: boolean;
  collections: CollectionResponse[];
  handleSelect: (e: any) => void;
}

export const CollectionSelect = ({
  isLoading,
  collections,
  handleSelect,
}: CollectionSelectProps) => {
  return !isLoading ? (
    <Select
      isRequired
      aria-label="Filtrar por campo"
      label="Selecciona una catalogo"
      variant="bordered"
      onChange={handleSelect}
    >
      {collections.map((collection) => (
        <SelectItem
          key={JSON.stringify({
            selected: collection.name,
            name: collection.nameView,
          })}
          value={JSON.stringify({
            selected: collection.name,
            name: collection.nameView,
          })}
        >
          {collection.nameView}
        </SelectItem>
      ))}
    </Select>
  ) : null;
};
