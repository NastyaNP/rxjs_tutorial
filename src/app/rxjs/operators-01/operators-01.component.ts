import { Component, OnInit } from "@angular/core";
import {
    concatMap, delay,
    filter,
    map,
    of
} from "rxjs";
import { NzInputDirective } from "ng-zorro-antd/input";
import { CommonModule } from "@angular/common";
import { NzSpinComponent } from "ng-zorro-antd/spin";

@Component({
    selector: "app-operators-01",
    standalone: true,
    imports: [
        NzInputDirective,
        CommonModule,
        NzSpinComponent
    ],
    templateUrl: "./operators-01.component.html",
    styleUrl: "./operators-01.component.less"
})
export class Operators01Component implements OnInit {

    public readonly stream$ = of(1, 2, 3, 4, 6, 8).pipe(
        concatMap((value) => of(value).pipe(delay(1000)))
    );

    public ngOnInit(): void {
        const evenSquares$ = this.stream$.pipe(
            map((value) => value ** 2),
            filter((value) => value % 2 === 0),
        );

        evenSquares$.subscribe((evenSquare) => console.log({ evenSquare }));
    }
}
