import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzFlexDirective } from "ng-zorro-antd/flex";
import { NzSpaceComponent } from "ng-zorro-antd/space";
import { concatMap, delay, finalize, interval, of, ReplaySubject, share, shareReplay, takeUntil, tap } from "rxjs";

@Component({
    selector: "app-multicasting-04",
    standalone: true,
    imports: [ CommonModule, NzButtonComponent, NzSpaceComponent, NzFlexDirective ],
    templateUrl: "./multicasting-04.component.html",
    styleUrl: "./multicasting-04.component.less",
})
export class Multicasting04Component {
    public subs: number[] = [];
    public isSubscriptionsVisible: boolean = true;

    private readonly unsub$ = new ReplaySubject<void>(1);

    public readonly stream$ = of(1, 2, 3)
        .pipe(
            tap(() => console.log("side effect")),
            concatMap((value: number) => of(value).pipe(
                delay(1_000)
            )),
            finalize(() => console.log("completed")),
        );

    public readonly sharedStream$ = this.stream$.pipe(
        share(),
    );

    public readonly sharedStreamWithCache$ = this.stream$.pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        finalize(() => console.log("share completed"))
    );

    public readonly sharedInterval$ = interval(1_000).pipe(
        shareReplay(1),
        finalize(() => console.log("shared interval completed"))
    );

    public readonly httpRequest$ = inject(HttpClient).get("https://dummyjson.com/products/search?q=phone").pipe(
        tap((res) => console.log("Request response", res)),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );

    public onAddSub(): void {
        this.subs.push((this.subs.at(-1) ?? 0) + 1);
    }

    public onRemoveSub(): void {
        this.subs.pop();
    }

    public toggleSubscriptions(): void {
        this.isSubscriptionsVisible = !this.isSubscriptionsVisible;
        this.unsub$.next();
    }

    public clear(): void {
        this.subs = [];

    }
}
