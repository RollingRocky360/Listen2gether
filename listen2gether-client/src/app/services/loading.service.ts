import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    isSearchLoading$ = new BehaviorSubject(0);
    isQueueLoading$ = new BehaviorSubject(0);

    incrementSearchLoadCount() {
        this.isSearchLoading$.next(this.isSearchLoading$.getValue() + 1);
    }

    decrementSearchLoadCount() {
        this.isSearchLoading$.next(this.isSearchLoading$.getValue() - 1);
    }

    incrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() + 1);
    }

    decrementQueueLoadCount() {
        this.isQueueLoading$.next(this.isQueueLoading$.getValue() - 1);
    }
}