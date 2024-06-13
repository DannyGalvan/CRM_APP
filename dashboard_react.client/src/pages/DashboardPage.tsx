import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Suspense, lazy } from "react";
import { Grid } from "../components/grid/Grid";
import { LoadingComponent } from "../components/spinner/LoadingComponent";
import { chartdata } from "../util/chartData";
import { dataFormatter } from "../util/converted";

const ProtectedPublic = lazy(
  () => import("../routes/middlewares/ProtectedPublic"),
);
const LineChart = lazy(() =>
  import("@tremor/react").then((module) => ({ default: module.LineChart })),
);

export function Component() {
  return (
    <ProtectedPublic>
      <div>
        <h1 className="text-center text-3xl font-bold" id="tabelLabel">
          Dashboard
        </h1>
        <Grid lg={3} md={2} xs={1} className="my-3 p-4">
          <Card className="border-t-large border-t-blue-700 bg-primary-50">
            <CardHeader>
              <h1 className="text-xl font-bold">Total Ventas 2023</h1>
            </CardHeader>
            <CardBody>
              <p className="text-center text-4xl">
                ${" "}
                {chartdata
                  .reduce((acc, item) => acc + item["Ventas 2023"], 0)
                  .toFixed(2)}
              </p>
            </CardBody>
          </Card>
          <Card className="border-t-large border-t-blue-700 bg-secondary-50">
            <CardHeader>
              <h1 className="text-xl font-bold">Total Ventas 2024</h1>
            </CardHeader>
            <CardBody>
              <p className="text-center text-4xl">
                ${" "}
                {chartdata
                  .reduce((acc, item) => acc + item["Ventas 2024"], 0)
                  .toFixed(2)}
              </p>
            </CardBody>
          </Card>
          <Card className="border-t-large border-t-blue-700 bg-success-50">
            <CardHeader>
              <h1 className="text-xl font-bold">
                Total Ventas Ultimos dos años
              </h1>
            </CardHeader>
            <CardBody>
              <p className="text-center text-4xl">
                ${" "}
                {(
                  chartdata.reduce(
                    (acc, item) => acc + item["Ventas 2023"],
                    0,
                  ) +
                  chartdata.reduce((acc, item) => acc + item["Ventas 2024"], 0)
                ).toFixed(2)}
              </p>
            </CardBody>
          </Card>
        </Grid>
        <Grid lg={2} md={2} xs={1} className="my-3 p-4">
          <div>
            <h1 className="text-center text-lg font-bold">Ventas 2023</h1>
            <Suspense fallback={<LoadingComponent />}>
              <LineChart
                className="h-80"
                data={chartdata}
                index="date"
                categories={["Ventas 2024"]}
                colors={["purple"]}
                valueFormatter={dataFormatter}
                yAxisWidth={60}
                onValueChange={(v) => console.log(v)}
              />
            </Suspense>
          </div>
          <div>
            <h1 className="text-center text-lg font-bold">Ventas 2024</h1>
            <Suspense fallback={<LoadingComponent />}>
              <LineChart
                className="h-80"
                data={chartdata}
                index="date"
                categories={["Ventas 2023"]}
                colors={["rose"]}
                valueFormatter={dataFormatter}
                yAxisWidth={60}
                onValueChange={(v) => console.log(v)}
              />
            </Suspense>
          </div>
        </Grid>
        <div className="py-10">
          <h1 className="text-center text-2xl font-bold">
            Grafica de Comparación
          </h1>
          <Suspense fallback={<LoadingComponent />}>
            <LineChart
              className="h-80"
              data={chartdata}
              index="date"
              categories={["Ventas 2023", "Ventas 2024"]}
              colors={["indigo", "rose"]}
              valueFormatter={dataFormatter}
              yAxisWidth={60}
              onValueChange={(v) => console.log(v)}
            />
          </Suspense>
        </div>
      </div>
    </ProtectedPublic>
  );
}

Component.displayName = "DashboardPage";
