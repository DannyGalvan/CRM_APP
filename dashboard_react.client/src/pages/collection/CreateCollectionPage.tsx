import Protected from "../../routes/middlewares/Protected";

export const CreateCollectionPage = () => {
  return (
    <Protected>
      <div className="page-view container flex flex-col flex-wrap items-center justify-center">
        <h1 className="text-center text-2xl font-bold">Crear Tablas</h1>
      </div>
    </Protected>
  );
};
