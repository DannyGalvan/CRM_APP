import { ReactNode, useEffect } from "react";
import { CatalogueForm } from "../components/forms/CatalogueForm";
import { CustomerForm } from "../components/forms/CustomerForm";
import { ProductForm } from "../components/forms/ProductForm";
import { initialCatalogue } from "../pages/catalogue/CreateCataloguePage";
import { initialCustomer } from "../pages/customer/CustomerCreatePage";
import { initialProduct } from "../pages/product/CreateProductPage";
import { useModalCreateStore } from "../store/useModalCreateStore";
import { useCatalogues } from "./useCatalogues";
import { useCustomer } from "./useCustomer";
import { useProducts } from "./useProducts";
import { PilotForm } from "../components/forms/PilotForm";
import { initialPilot } from "../pages/pilots/CreatePilotPage";
import { usePilots } from "./usePilots";
import { useErrorsStore } from "../store/useErrorsStore";

export type ModalType =
  | "Municipalities"
  | "Zones"
  | "Departments"
  | ""
  | "Customers"
  | "PaymentTypes"
  | "Products"
  | "Families"
  | "Pilots";

export const useModalStrategies = () => {
  const { createCatalog, collectionError } = useCatalogues();
  const { create } = useCustomer();
  const { create: createProduct } = useProducts();
  const { create: cretePilot } = usePilots();
  const { modal } = useModalCreateStore();
  const { setError } = useErrorsStore();

  useEffect(() => {
    if (collectionError) {
      setError(collectionError);
    }
  }, [collectionError, setError]);

  const openCreate = () => {
    const select = {
      name: modal.title,
      selected: modal.keyForm,
    };

    const catalogCreate = (catalogue: CatalogueRequest) =>
      createCatalog(catalogue, select);

    const ModalStrategies: Record<ModalType, ReactNode> = {
      Municipalities: (
        <CatalogueForm
          collectionError={collectionError}
          selectedCatalogue={select}
          sendForm={catalogCreate}
          text="Crear"
          initialForm={initialCatalogue}
          reboot
        />
      ),
      Zones: (
        <CatalogueForm
          collectionError={collectionError}
          selectedCatalogue={select}
          sendForm={catalogCreate}
          text="Crear"
          initialForm={initialCatalogue}
          reboot
        />
      ),
      Departments: (
        <CatalogueForm
          collectionError={collectionError}
          selectedCatalogue={select}
          sendForm={catalogCreate}
          text="Crear"
          initialForm={initialCatalogue}
          reboot
        />
      ),
      Customers: (
        <CustomerForm
          initialForm={initialCustomer}
          sendForm={create}
          text="Crear"
          reboot
        />
      ),
      PaymentTypes: (
        <CatalogueForm
          collectionError={collectionError}
          selectedCatalogue={select}
          sendForm={catalogCreate}
          text="Crear"
          initialForm={initialCatalogue}
          reboot
        />
      ),
      Families: (
        <CatalogueForm
          collectionError={collectionError}
          selectedCatalogue={select}
          sendForm={catalogCreate}
          text="Crear"
          initialForm={initialCatalogue}
          reboot
        />
      ),
      Products: (
        <ProductForm
          initialForm={initialProduct}
          sendForm={createProduct}
          text="Crear"
          reboot
        />
      ),
      Pilots: (
        <PilotForm
          initialForm={initialPilot}
          sendForm={cretePilot}
          text="Crear"
          reboot
        />
      ),
      "": <span>Sin Formulario</span>,
    };

    return ModalStrategies[modal.keyForm];
  };

  return { openCreate };
};
