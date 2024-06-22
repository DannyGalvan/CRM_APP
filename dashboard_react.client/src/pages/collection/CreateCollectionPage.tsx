import Protected from "../../routes/middlewares/Protected";
import { CollectionRequest } from "../../types/CollectionRequest";

export const initialCollection : CollectionRequest = {
  description: "",
  name: "",
  isReadOnly: false,
  isVisible : true,
  nameView  : "",
}

export const CreateCollectionPage = () => {
  return (
    <Protected>
      <div className="page-view container flex flex-col flex-wrap items-center justify-center">
        <h1 className="text-center text-2xl font-bold">Crear Tablas</h1>
      </div>
    </Protected>
  );
};
