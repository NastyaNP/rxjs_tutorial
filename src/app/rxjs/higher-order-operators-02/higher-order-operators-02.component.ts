import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
    BehaviorSubject, combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter, finalize,
    fromEvent,
    map,
    Observable,
    of,
    ReplaySubject, shareReplay, startWith, switchMap, takeUntil,
    tap
} from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { CommonModule } from "@angular/common";
import { NzInputDirective } from "ng-zorro-antd/input";
import { NzSpinComponent } from "ng-zorro-antd/spin";
import { NzPopoverDirective } from "ng-zorro-antd/popover";

@Component({
    selector: "app-higher-order-operators-02",
    standalone: true,
    imports: [
        CommonModule,
        NzInputDirective,
        NzSpinComponent,
        NzPopoverDirective
    ],
    templateUrl: "./higher-order-operators-02.component.html",
    styleUrl: "./higher-order-operators-02.component.less"
})
export class HigherOrderOperators02Component implements OnInit, OnDestroy, AfterViewInit {

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
        // this.dataFromServer$ = fromEvent(this.inputEl.nativeElement, "input").pipe(
        //     debounceTime(500),
        //     map((event) => (event.target as HTMLInputElement).value),
        //     distinctUntilChanged(),
        //     switchMap((searchValue: string) => ajax<object[]>(`https://dummyjson.com/products/search?q=${searchValue}`).pipe(
        //         map((response: AjaxResponse<object[]>) => response.response)
        //     )),
        //     takeUntil(this.destroy$),
        // );

        this.dataFromServer$ = fromEvent(this.inputEl.nativeElement, "input").pipe(
            tap(() => this.setLoading$.next(true)),
            debounceTime(500),
            map((event) => (event.target as HTMLInputElement).value),
            filter((searchValue: string) => {
                console.log({ searchValue });
                const condition = searchValue.length >= this.minimumSearchLength;
                this.setNotification$.next(!condition);
                return condition;
            }),
            distinctUntilChanged(),
            switchMap((searchValue: string) => {
                this.setLoading$.next(true);
                return ajax<object[]>(`https://dummyjson.com/products/search?q=${searchValue}`).pipe(
                    map((response: AjaxResponse<object[]>) => response.response),
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
