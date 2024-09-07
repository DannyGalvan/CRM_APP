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
  const { create: createPilot } = usePilots();
  const { modal } = useModalCreateStore();
  const { setError } = useErrorsStore();

  useEffect(() => {
    if (collectionError) {
      setError(collectionError);
    }
  }, [collectionError, setError]);

  const catalogCreate = (catalogue: CatalogueRequest) =>
    createCatalog(catalogue, {
      name: modal.title,
      selected: modal.keyForm,
    });

  const commonCatalogueForm = () => (
    <CatalogueForm
      collectionError={collectionError}
      selectedCatalogue={{ name: modal.title, selected: modal.keyForm }}
      sendForm={catalogCreate}
      text="Crear"
      initialForm={initialCatalogue}
      reboot
    />
  );

  const ModalStrategies: Record<ModalType, ReactNode> = {
    Municipalities: commonCatalogueForm(),
    Zones: commonCatalogueForm(),
    Departments: commonCatalogueForm(),
    PaymentTypes: commonCatalogueForm(),
    Families: commonCatalogueForm(),
    Customers: (
      <CustomerForm
        initialForm={initialCustomer}
        sendForm={create}
        text="Crear"
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
        sendForm={createPilot}
        text="Crear"
        reboot
      />
    ),
    "": <span>Sin Formulario</span>,
  };

  const openCreate = () => ModalStrategies[modal.keyForm];

  return { openCreate };
};
