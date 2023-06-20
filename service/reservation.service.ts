import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export interface IReservationFormPreData {
    type: "food" | "flat-bench";
    date: string;
    time?: "12:00" | "15:00";
}

export interface IReservationForm extends IReservationFormPreData {
    name: string;
    guests: number;
    tel: string;
    car: string;
    note: string;
    service: {
        능이백숙?: number;
        백숙?: number;
        버섯찌개?: number;
        버섯찌개2?: number;
        평상?: number;
        테이블?: number;
    };
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
        guests: 4,
        service: {
            능이백숙: undefined,
            백숙: undefined,
            버섯찌개: undefined,
            버섯찌개2: undefined,
            평상: undefined,
            테이블: undefined,
        },
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
