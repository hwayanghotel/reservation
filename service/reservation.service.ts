import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IDBService, DBService } from "./DB.service";
import { Price } from "src/assets/price";

export const MAX_RESERVATION = {
    식사자리: 14,
    평상: 6,
    테이블: 6,
    주차: 35,
};

export interface IBookingAvailable {
    잔여식사자리: number;
    잔여평상: number;
    잔여테이블: number;
    잔여주차: number;
}

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
    formData$: BehaviorSubject<IDBService> = new BehaviorSubject<IDBService>({});

    bookingAvailable$: BehaviorSubject<IBookingAvailable> = new BehaviorSubject(undefined);

    constructor(private DBService: DBService) {
        this.bookingStep$.subscribe((isOpen) => {
            if (isOpen > 0) {
                this._updateBookingAvailable();
            }
        });

        this.formData$.subscribe((v) => {
            console.log("formData update", v);
        });
    }

    private async _updateBookingAvailable() {
        let bookingAvailable: IBookingAvailable = {
            잔여식사자리: MAX_RESERVATION["식사자리"],
            잔여평상: MAX_RESERVATION["평상"],
            잔여테이블: MAX_RESERVATION["테이블"],
            잔여주차: MAX_RESERVATION["주차"],
        };
        const dailyData = await this.DBService.getDailyData(
            this.formData$.getValue()["예약유형"],
            this.formData$.getValue()["날짜"]
        );
        dailyData.forEach((data) => {
            const numberOfChicken: number = data["능이백숙"] + data["백숙"];
            const numberOfMushroom: number = data["버섯찌개"] + data["버섯찌개2"];
            bookingAvailable["잔여식사자리"] -= numberOfChicken + numberOfMushroom;
            bookingAvailable["잔여평상"] -= data["평상"];
            bookingAvailable["잔여테이블"] -= data["테이블"];
            bookingAvailable["잔여주차"] -= data["차량번호"].length;
        });
        this.bookingAvailable$.next(bookingAvailable);
    }

    getReservationCost(model: IDBService): number {
        const flatTableCost: number = model["평상"] * Price["평상"] + model["테이블"] * Price["테이블"];
        const addedGuests: number =
            model["인원"] -
            model["평상"] * StandardNumberOfPeople["평상"].적정인원 -
            model["테이블"] * StandardNumberOfPeople["테이블"];
        return flatTableCost + (addedGuests > 0 ? addedGuests * Price["평상추가인원"] : 0);
    }
}
