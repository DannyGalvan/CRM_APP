import { CatalogueForm } from "../../components/forms/CatalogueForm";
import { Col } from "../../components/grid/Col";
import { CollectionSelect } from "../../components/select/CollectionSelect";
import { useCatalogues } from "../../hooks/useCatalogues";
import Protected from "../../routes/middlewares/Protected";

export const initialCatalogue: CatalogueRequest = {
  name: "",
  description: "",
  state: 1,
};

export const CreateCataloguePage = () => {
  const {
    collectionError,
    collections,
    collectionFetching,
    collectionLoading,
    handleSelect,
    createCatalog,
    selectedCatalogue,
  } = useCatalogues();

  return (
    <Protected>
      <div className="page-view flex flex-col flex-wrap items-center justify-center">
      <Col md={6}>
        <Col md={12}>
          <CollectionSelect
            collections={collections}
            handleSelect={handleSelect}
            isLoading={collectionFetching || collectionLoading}
          />
        </Col>
        <CatalogueForm
          initialForm={initialCatalogue}
          sendForm={createCatalog}
          collectionError={collectionError}
          selectedCatalogue={selectedCatalogue}
          text="Crear"
          reboot
        />
      </Col>
    </div>
    </Protected>
  );
};
