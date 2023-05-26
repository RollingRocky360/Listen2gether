import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isSearchLoading$ = new BehaviorSubject(false);
    isQueueLoading$ = new BehaviorSubject(0);

    setSearchLoad() {
        this.isSearchLoading$.next(true);
    }

    unsetSearchLoad() {
        this.isSearchLoading$.next(false);
    }

    incrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() + 1);
    }

    decrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() - 1);
    }
}