import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IUserDB } from "./DB.service";
import { Price } from "src/assets/price";

export const MAX_RESERVATION = {
    식사자리: 14,
    평상: 6,
    테이블: 6,
    주차: 35,
};

export const StandardNumberOfPeople = {
    식사좌석: 4,
    평상: { 적정인원: 4, 최대인원: 7 },
    테이블: 4,
    평상주차: 2,
    식사주차: 1,
};

@Injectable({
    providedIn: "root",
})
export class ReservationService {
    bookingStep$: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);
    formData$: BehaviorSubject<IUserDB> = new BehaviorSubject<IUserDB>({});

    constructor() {
        this.formData$.subscribe((v) => {
            console.log("formData$ update", v);
        });
    }

    getReservationCost(model: IUserDB): number {
        const flatTableCost: number = (model["평상"] || 0) * Price["평상"] + (model["테이블"] || 0) * Price["테이블"];
        if (flatTableCost === 0) {
            return 0;
        }
        const addedGuests: number =
            model["인원"] -
            (model["평상"] || 0) * StandardNumberOfPeople["평상"].적정인원 -
            (model["테이블"] || 0) * StandardNumberOfPeople["테이블"];
        return flatTableCost + (addedGuests > 0 ? addedGuests * Price["평상추가인원"] : 0);
    }
}
