import { RouteDetailsRequest } from "./RouteDetailsRequest";


 export interface BulkRouteDetailRequest {
    routeDetails: RouteDetailsRequest[];
    createdBy: string;
}