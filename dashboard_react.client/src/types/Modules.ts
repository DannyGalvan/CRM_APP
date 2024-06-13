import { Catalogue } from "./Catalogue";
import { Operations } from "./Operations";

export interface Module extends Catalogue{
    image: string;
    path: string;

    operations?: Operations[];
}