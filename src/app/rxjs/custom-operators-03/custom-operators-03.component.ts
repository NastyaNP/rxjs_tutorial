import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    BehaviorSubject, catchError,
    combineLatest,
    debounceTime, distinctUntilChanged, exhaustMap, filter, finalize,
    fromEvent,
    map, mergeMap,
    Observable,
    of,
    ReplaySubject,
    startWith, switchMap, takeUntil,
    tap
} from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { processSearchValue } from "./process-search-value.operator";
import { NzSpinComponent } from "ng-zorro-antd/spin";
import { NzInputDirective } from "ng-zorro-antd/input";

@Component({
    selector: "app-custom-operators-03",
    standalone: true,
    imports: [CommonModule, NzSpinComponent, NzInputDirective],
    templateUrl: "./custom-operators-03.component.html",
    styleUrl: "./custom-operators-03.component.less"
})
export class CustomOperators03Component implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("input")
    private readonly inputEl!: ElementRef<HTMLInputElement>;

    public dataFromServer$: Observable<object[] | null> = of(null);

    public showLoader$: Observable<boolean> = of(false);
    public showNotification$: Observable<boolean> = of(false);

    private readonly minimumSearchLength = 3;

    private readonly destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);
    private readonly setLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private readonly setNotification$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public get notificationTitle(): string {
        return `Enter at least ${this.minimumSearchLength} chars!`;
    }

    public ngOnInit(): void {
        this.showNotification$ = this.setNotification$.asObservable();
        this.showLoader$ = combineLatest([this.showNotification$, this.setLoading$]).pipe(
            map(([showNotification, loading]: [boolean, boolean]) => !showNotification && loading),
        );
    }

    public ngAfterViewInit(): void {
        this.dataFromServer$ = fromEvent(this.inputEl.nativeElement, "input").pipe(
            tap(() => this.setLoading$.next(true)),
            map((event) => (event.target as HTMLInputElement).value),
            processSearchValue({
                debounceTime: 500,
                distinctUntilChanged: true,
                minSearchLength: this.minimumSearchLength,
                whenSearchValueNotPassed: () => this.setNotification$.next(true),
                whenNotDistinctive: () => this.setLoading$.next(false)
            }),
            tap(() => this.setNotification$.next(false)),
            switchMap((searchValue: string) => {
                this.setLoading$.next(true);
                return ajax<object[]>(`https://dummyjson.com/products/search?q=${searchValue}`).pipe(
                    map((response: AjaxResponse<object[]>) => response.response),
                    catchError((err: unknown) => {
                        console.error(err);
                        return of(null);
                    }),
                    finalize(() => this.setLoading$.next(false))
                );
            }),
            takeUntil(this.destroy$),
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
