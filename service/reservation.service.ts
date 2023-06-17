import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export interface IReservationFormPreData {
    type: "food" | "flat-bench";
    date: string;
    time?: "12:00" | "15:00";
    service?: number[];
}

export interface IReservationForm extends IReservationFormPreData {
    link?: "food" | "flat-bench";
    name: string;
    guests: number;
    tel: number;
    car: string;
    note: string;
}

@Injectable({
    providedIn: "root",
})
export class ReservationService {
    isOpen$: Subject<boolean> = new Subject<boolean>();
    formData$: BehaviorSubject<IReservationForm> = new BehaviorSubject<IReservationForm>({
        type: undefined,
        date: undefined,
        time: undefined,
        name: undefined,
        guests: undefined,
        service: undefined,
        tel: undefined,
        car: undefined,
        note: undefined,
    });

    constructor() {}

    setReservationFormPreData(data: IReservationFormPreData) {
        this.formData$.next({
            ...this.formData$.getValue(),
            type: data.type,
            time: data.time,
            date: data.date,
        });
    }
    setReservationForm(data: IReservationForm) {
        this.formData$.next(data);
    }
}
