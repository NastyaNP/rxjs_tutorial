import { Routes } from "@angular/router";
import { Combination05Component } from "./rxjs/combination-05/combination-05.component";
import { Multicasting04Component } from "./rxjs/multicasting-04/multicasting-04.component";
import { Operators01Component } from "./rxjs/operators-01/operators-01.component";
import { HigherOrderOperators02Component } from "./rxjs/higher-order-operators-02/higher-order-operators-02.component";
import { CustomOperators03Component } from "./rxjs/custom-operators-03/custom-operators-03.component";

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "/operators-01" },
    { path: "operators-01", component: Operators01Component },
    { path: "higher-order-operators-02", component: HigherOrderOperators02Component },
    { path: "custom-operators-03", component: CustomOperators03Component },
    { path: "multicasting-04", component: Multicasting04Component },
    { path: "combination-05", component: Combination05Component },
];
