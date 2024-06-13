import { Select, SelectItem } from "@nextui-org/react";
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
      label="Selecciona una catalogo"
      onChange={handleSelect}
      variant="bordered"
      draggable={true}
      isRequired
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
