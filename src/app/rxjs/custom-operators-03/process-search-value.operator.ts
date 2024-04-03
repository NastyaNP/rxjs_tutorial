import { debounceTime, distinctUntilChanged, MonoTypeOperatorFunction, Observable } from "rxjs";
import { filter } from "rxjs/operators";

function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === "function";
}

export interface SearchValueProcessingOptions {
    debounceTime?: number;
    minSearchLength?: number;
    distinctUntilChanged?: boolean | ((previous: string, current: string) => boolean);
    whenNotDistinctive?: () => void;
    whenSearchValueNotPassed?: (searchValue: string) => void;
}

export function processSearchValue(options: SearchValueProcessingOptions): MonoTypeOperatorFunction<string> {
    const searchOptions: Required<SearchValueProcessingOptions> = {
        debounceTime: options.debounceTime ?? 0,
        distinctUntilChanged: options.distinctUntilChanged ?? false,
        minSearchLength: options.minSearchLength ?? 0,
        whenNotDistinctive: options.whenNotDistinctive ?? (() => null),
        whenSearchValueNotPassed: options.whenSearchValueNotPassed ?? (() => null),
    };

    return (source$: Observable<string>) => source$.pipe(
        debounceTime(searchOptions.debounceTime ?? 0),
        distinctUntilChanged((previous: string, current: string) => {
            const isNotDistinctive: boolean = isFunction(searchOptions.distinctUntilChanged)
                ? searchOptions.distinctUntilChanged(previous, current)
                : searchOptions.distinctUntilChanged
                    ? previous === current
                    : false;

            if (!isNotDistinctive && isFunction(searchOptions.whenNotDistinctive)) {
                searchOptions.whenNotDistinctive();
            }

            return isNotDistinctive;
        }),
        filter((searchValue: string) => {
            const isValuePassed: boolean = searchValue?.length >= searchOptions.minSearchLength;

            if (!isValuePassed && isFunction(options.whenSearchValueNotPassed)) {
                searchOptions.whenSearchValueNotPassed(searchValue);
            }

            return isValuePassed;
        })
    );
}

