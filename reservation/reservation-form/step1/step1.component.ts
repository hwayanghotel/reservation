import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";

@Component({
    selector: "step1",
    templateUrl: "./step1.component.html",
    styleUrls: ["../reservation-form.component.scss"],
})
export class Step1Component {
    model: IReservationForm;
    bookingAvailable: IBookingAvailable;
    availableTables: number;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
            this._setAvailableTables();
        });
    }

    private _setAvailableTables() {
        if (this.model["시간"] === 12) {
            this.availableTables = this.bookingAvailable["잔여12시식사"];
        }
        if (this.model["시간"] === 15) {
            this.availableTables = this.bookingAvailable["잔여15시식사"];
        }
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(0);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("입력된 정보가 올바른지 확인해주세요.", null, { duration: 2000 });
        } else {
            let step: number = 2;
            if (this.model["예약유형"] === "평상") {
                this._setRecommandFlatTable();
                step = 2;
            }
            if (this.model["예약유형"] === "식사") {
                this._setRecommandFood();
                step = 3;
            }
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(step);
        }
    }

    private _checkStep(): boolean {
        return Boolean(this.model["성함"] && this.model["전화번호"] && this.model["인원"]);
    }

    private _setRecommandFlatTable() {
        let person: number = this.model["인원"];
        this.model["평상"] = Math.round(person / StandardNumberOfPeople["평상"]["적정인원"]);
        if (this.model["평상"] > this.bookingAvailable["잔여평상"]) {
            this.model["평상"] = this.bookingAvailable["잔여평상"];
            person -= this.model["평상"] * StandardNumberOfPeople["평상"]["적정인원"];
            this.model["테이블"] = Math.round(person / StandardNumberOfPeople["테이블"]);
            if (this.model["테이블"] > this.bookingAvailable["잔여테이블"]) {
                this.model["테이블"] = this.bookingAvailable["잔여테이블"];
                person -= this.model["테이블"] * StandardNumberOfPeople["테이블"];
                console.warn("적정 인원 대비 평상이 부족합니다", person);
            }
        }
    }

    private _setRecommandFood() {
        let person: number = this.model["인원"];
        this.model["능이백숙"] = Math.round(person / StandardNumberOfPeople["식사좌석"]);
        if (this.model["능이백숙"] > this.bookingAvailable["잔여백숙"]) {
            this.model["능이백숙"] = this.bookingAvailable["잔여백숙"];
            person -= this.model["능이백숙"] * StandardNumberOfPeople["식사좌석"];
            this.model["버섯찌개"] = Math.round(person / StandardNumberOfPeople["식사좌석"]);
            if (this.model["버섯찌개"] > this.bookingAvailable["잔여버섯"]) {
                this.model["버섯찌개"] = this.bookingAvailable["잔여버섯"];
                person -= this.model["버섯찌개"] * StandardNumberOfPeople["식사좌석"];
                console.warn("적정 인원 대비 식사가 부족합니다", person);
            }
        }
    }

    get warning(): boolean {
        return this.goodNumberOfTables > this.availableTables;
    }

    get goodNumberOfTables(): number {
        if (this.model["인원"] < 5) return 1;
        return Math.round(this.model["인원"] / StandardNumberOfPeople["식사좌석"]);
    }
}
