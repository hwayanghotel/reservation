import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export interface IReservationFormPreData {
    예약유형: "식사" | "평상";
    날짜: string;
    시간?: 12 | 15 | 0;
    상태: "대기중" | "취소" | "예약완료";
}

export interface IReservationForm extends IReservationFormPreData {
    성함: string;
    인원: number;
    전화번호: string;
    차량번호: string;
    메모: string;
    평상?: number;
    테이블?: number;
    능이백숙?: number;
    백숙?: number;
    버섯찌개?: number;
    버섯찌개2?: number;
}

@Injectable({
    providedIn: "root",
})
export class ReservationService {
    isOpen$: Subject<boolean> = new Subject<boolean>();
    formData$: BehaviorSubject<IReservationForm> = new BehaviorSubject<IReservationForm>({
        예약유형: undefined,
        날짜: undefined,
        시간: undefined,
        상태: "대기중",
        성함: undefined,
        인원: 4,
        전화번호: undefined,
        차량번호: undefined,
        메모: undefined,
        평상: undefined,
        테이블: undefined,
        능이백숙: undefined,
        백숙: undefined,
        버섯찌개: undefined,
        버섯찌개2: undefined,
    });

    constructor() {}

    setReservationFormPreData(data: IReservationFormPreData) {
        this.formData$.next({
            ...this.formData$.getValue(),
            예약유형: data["예약유형"],
            시간: data["시간"],
            날짜: data["날짜"],
        });
    }
    setReservationForm(data: IReservationForm) {
        this.formData$.next(data);
    }
}
