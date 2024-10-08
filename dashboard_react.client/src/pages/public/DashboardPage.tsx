import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Suspense, lazy } from "react";

import { Grid } from "../../components/grid/Grid";
import { LoadingComponent } from "../../components/spinner/LoadingComponent";
import { MONTHS } from "../../config/contants";
import { useDashboard } from "../../hooks/useDashboard";
import { dataFormatter } from "../../util/converted";
import { NotFound } from "../error/NotFound";

const ProtectedPublic = lazy(
  () => import("../../routes/middlewares/ProtectedPublic"),
);
const LineChart = lazy(() =>
  import("@tremor/react").then((module) => ({ default: module.LineChart })),
);

export function Component() {
  const {
    isPending,
    data,
    dataOrders,
    month,
    month_orders,
    year,
    pendingOrders,
    year_orders,
    error,
  } = useDashboard();

  if (error) {
    return <NotFound Message={error.message} Number={error.statusCode} />;
  }

  return (
    <ProtectedPublic>
      <div>
        <h1 className="text-center text-3xl font-bold" id="tabelLabel">
          Dashboard
        </h1>
        <Grid className="p-4 my-3" md={1}>
          <div>
            <Grid className="p-4 my-3" lg={2} md={2} xs={1}>
              <Card className="border-t-large border-t-blue-700 bg-success-50">
                <CardHeader>
                  <h1 className="text-xl font-bold">
                    Total Ordenes {MONTHS[month]} {year}
                  </h1>
                </CardHeader>
                <CardBody>
                  <p className="text-center text-4xl">
                    Q {!pendingOrders && dataOrders?.totalOrders.toFixed(2)}
                  </p>
                </CardBody>
              </Card>
              <Card className="border-t-large border-t-blue-700 bg-success-50">
                <CardHeader>
                  <h1 className="text-xl font-bold">
                    Cantidad de Ordenes {MONTHS[month]} {year}
                  </h1>
                </CardHeader>
                <CardBody>
                  <p className="text-center text-4xl">
                    {!pendingOrders && dataOrders?.quantityOrders}
                  </p>
                </CardBody>
              </Card>
            </Grid>
          </div>
          <div>
            <h1 className="text-center text-lg font-bold">
              Ordenes {MONTHS[month]} {year}
            </h1>
            <Suspense fallback={<LoadingComponent />}>
              {pendingOrders ? (
                <LoadingComponent />
              ) : (
                <LineChart
                  categories={[month_orders]}
                  className="h-80"
                  colors={["violet"]}
                  data={dataOrders?.orders as any}
                  index="date"
                  maxValue={
                    dataOrders?.totalOrders! / dataOrders?.quantityOrders! +
                    1000
                  }
                  valueFormatter={dataFormatter}
                  yAxisWidth={50}
                />
              )}
            </Suspense>
          </div>
          <div>
            <Grid lg={2} md={2} xs={1}>
              <Card className="border-t-large border-t-blue-700 bg-primary-50">
                <CardHeader>
                  <h1 className="text-xl font-bold">Total Ordenes {year}</h1>
                </CardHeader>
                <CardBody>
                  <p className="text-center text-4xl">
                    Q {!isPending && data?.totalOrders.toFixed(2)}
                  </p>
                </CardBody>
              </Card>
              <Card className="border-t-large border-t-blue-700 bg-primary-50">
                <CardHeader>
                  <h1 className="text-xl font-bold">
                    Cantidad de Ordenes {year}
                  </h1>
                </CardHeader>
                <CardBody>
                  <p className="text-center text-4xl">
                    {!isPending && data?.quantityOrders}
                  </p>
                </CardBody>
              </Card>
            </Grid>
          </div>
          <div>
            <h1 className="text-center text-lg font-bold">
              Ordenes año {year}
            </h1>
            <Suspense fallback={<LoadingComponent />}>
              {isPending ? (
                <LoadingComponent />
              ) : (
                <LineChart
                  categories={[year_orders]}
                  className="h-80"
                  colors={["yellow"]}
                  data={data?.orders as any}
                  index="date"
                  maxValue={data?.totalOrders! / data?.quantityOrders! + 5000}
                  valueFormatter={dataFormatter}
                  yAxisWidth={50}
                />
              )}
            </Suspense>
          </div>
        </Grid>
      </div>
    </ProtectedPublic>
  );
}

Component.displayName = "DashboardPage";
