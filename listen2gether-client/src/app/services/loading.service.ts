import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isSearchLoading$ = new BehaviorSubject(false);
    isQueueLoading$ = new BehaviorSubject(0);
    isAuthLoading$ = new BehaviorSubject(false);

    setSearchLoad() {
        this.isSearchLoading$.next(true);
    }

    unsetSearchLoad() {
        this.isSearchLoading$.next(false);
    }

    setAuthLoad() {
        this.isAuthLoading$.next(true);
    }

    unsetAuthLoad() {
        this.isAuthLoading$.next(false);
    }

    incrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() + 1);
    }

    decrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() - 1);
    }
}