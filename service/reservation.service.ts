import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IUserDB } from "./DB.service";
import { Price } from "reservation/service/booking/booking.service.interface";

export const MAX_RESERVATION = {
    식사자리: 16,
    평상: 6,
    데크: 6,
    주차: 40,
};

export const StandardNumberOfPeople = {
    식사좌석: 4,
    평상: { 적정인원: 4, 최대인원: 7 },
    데크: 4,
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
        const flatTableCost: number = (model["평상"] || 0) * Price["평상"] + (model["데크"] || 0) * Price["데크"];
        if (flatTableCost === 0) {
            return 0;
        }
        const addedGuests: number =
            model["인원"] - (model["평상"] || 0) * StandardNumberOfPeople["평상"].적정인원 - (model["데크"] || 0) * StandardNumberOfPeople["데크"];
        return flatTableCost + (addedGuests > 0 ? addedGuests * Price["평상추가인원"] : 0);
    }
}
