import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NzFlexDirective } from "ng-zorro-antd/flex";
import {
    concatMap,
    delay,
    MonoTypeOperatorFunction,
    Observable,
    of,
    zip,
    combineLatest,
    merge,
    concat,
    race, forkJoin, tap, debounceTime, EMPTY, startWith, observeOn, asapScheduler, debounce, withLatestFrom,
} from "rxjs";

function delayBeforeEach<T>(delayMs: number = 1_000): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) => source$.pipe(
        concatMap((value: T) => of(value).pipe(delay(delayMs)))
    );
}

function log<T>(): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) => source$.pipe(
        tap((value: T) => console.log({ loggedValue: value })),
    );
}

@Component({
    selector: "app-combination-05",
    standalone: true,
    imports: [
        CommonModule,
        NzFlexDirective,
    ],
    templateUrl: "./combination-05.component.html",
    styleUrl: "./combination-05.component.less",
})
export class Combination05Component {

    constructor() {
        this.stream1$.subscribe(x => console.log({ x }));
        console.log("sync")
    }

    public readonly stream2$ = of(4, 5, 6, 7).pipe(delayBeforeEach(1000));
    public readonly stream1$ = of(1, 2, 3).pipe(
        delayBeforeEach(1000),
        withLatestFrom(this.stream2$),
    );

    // private readonly params$ = combineLatest([this.sort$, this.filters$, this.pagination$])

    public readonly combineLatest$ = combineLatest([this.stream1$, this.stream2$]).pipe(
        debounce(() => of(null).pipe(observeOn(asapScheduler))),
        log()
    );
    public readonly forkJoin$ = forkJoin([this.stream1$, this.stream2$]);
    public readonly merge$ = merge(this.stream1$, this.stream2$).pipe(log());
    public readonly zip$ = zip(this.stream1$, this.stream2$);
    public readonly concat$ = concat(this.stream1$, this.stream2$);
    public readonly race$ = race(this.stream1$, this.stream2$);


}
