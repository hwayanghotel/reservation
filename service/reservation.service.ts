import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IDBService, DBService } from "./DB.service";
import { Price } from "src/assets/price";

export interface IReservationForm extends IDBService {
    id?: string;
    예약유형: "식사" | "평상";
    날짜: string;
    시간?: number;
    상태: "대기중" | "취소" | "예약완료";
    성함: string;
    인원: number;
    전화번호: string;
    차량번호: string[];
    메모: string;
    평상?: number;
    테이블?: number;
    능이백숙?: number;
    백숙?: number;
    버섯찌개?: number;
    버섯찌개2?: number;
}

export interface IBookingAvailable {
    잔여백숙: number;
    잔여버섯: number;
    잔여12시식사: number;
    잔여15시식사: number;
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
    reservationCheckUser: boolean;
    formData$: BehaviorSubject<IReservationForm> = new BehaviorSubject<IReservationForm>({
        예약유형: undefined,
        날짜: undefined,
        시간: undefined,
        상태: "대기중",
        성함: undefined,
        인원: 30,
        전화번호: undefined,
        차량번호: [undefined],
        메모: undefined,
        평상: 0,
        테이블: 0,
        능이백숙: 0,
        백숙: 0,
        버섯찌개: 0,
        버섯찌개2: 0,
    });

    bookingAvailable$: BehaviorSubject<IBookingAvailable> = new BehaviorSubject(undefined);

    constructor(private DBService: DBService) {
        this.bookingStep$.subscribe((isOpen) => {
            if (isOpen > 0) {
                this._updateBookingAvailable();
            }
        });

        //TEST
        this._test();
    }

    private async _updateBookingAvailable() {
        let bookingAvailable: IBookingAvailable = {
            잔여백숙: 30,
            잔여버섯: 10,
            잔여12시식사: 14,
            잔여15시식사: 14,
            잔여평상: 6,
            잔여테이블: 6,
            잔여주차: 30,
        };
        const dailyData = await this.DBService.getDailyData(
            this.formData$.getValue()["예약유형"],
            this.formData$.getValue()["날짜"]
        );
        dailyData.forEach((data) => {
            const numberOfChicken: number = data["능이백숙"] + data["백숙"];
            const numberOfMushroom: number = data["버섯찌개"] + data["버섯찌개2"];
            bookingAvailable["잔여백숙"] -= numberOfChicken;
            bookingAvailable["잔여버섯"] -= numberOfMushroom;
            bookingAvailable[data["시간"] === 12 ? "잔여12시식사" : "잔여15시식사"] -=
                numberOfChicken + numberOfMushroom;
            bookingAvailable["잔여평상"] -= data["평상"];
            bookingAvailable["잔여테이블"] -= data["테이블"];
            bookingAvailable["잔여주차"] -= data["차량번호"].length;
        });
        this.bookingAvailable$.next(bookingAvailable);
    }

    setReservationForm(data: any) {
        this.formData$.next({
            ...this.formData$.getValue(),
            ...data,
        });
    }

    add() {
        this.DBService.add(this.formData$.getValue());
    }

    edit() {
        this.DBService.edit(this.formData$.getValue());
    }

    cancel() {
        // this.DBService.delete(this.formData$.getValue());
        this.DBService.edit({
            ...this.formData$.getValue(),
            상태: "취소",
            메모:
                this.formData$.getValue()["메모"] +
                `/온라인 취소/${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        });
    }

    search(id?: string): Promise<IReservationForm[]> {
        return this.DBService.search(id, this.formData$.getValue());
    }

    getReservationCost(model: IReservationForm): number {
        const flatTableCost: number = model["평상"] * Price["평상"] + model["테이블"] * Price["테이블"];
        const addedGuests: number =
            model["인원"] -
            model["평상"] * StandardNumberOfPeople["평상"].적정인원 -
            model["테이블"] * StandardNumberOfPeople["테이블"];
        return flatTableCost + (addedGuests > 0 ? addedGuests * Price["평상추가인원"] : 0);
    }

    //TEST
    private _test() {
        setTimeout(() => {
            // this.setReservationForm({
            //     예약유형: "평상",
            //     날짜: "2023-06-30",
            //     성함: "박성수",
            //     전화번호: "010-9999-9999",
            //     시간: undefined,
            //     상태: "예약완료",
            //     인원: 7,
            //     차량번호: [],
            //     // 차량번호: ["01수0123", "02수2345"],
            //     메모: "아이가 한 명 있어요",
            //     평상: 1,
            //     테이블: 0,
            //     능이백숙: 0,
            //     백숙: 1,
            //     버섯찌개: 0,
            //     버섯찌개2: 0,
            // });
            // this.reservationCheckUser = true;
            // this.bookingStep$.next(5);
        }, 1000);

        this.formData$.subscribe((v) => {
            console.warn("formData update", v);
        });

        // this.DBService.firebaseStore$.subscribe((v) => {
        //     console.warn("DBService update", JSON.stringify(v));
        // });
    }
}
