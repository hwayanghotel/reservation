import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";

@Component({
    selector: "reservation-form",
    templateUrl: "./reservation-form.component.html",
    styleUrls: ["./reservation-form.component.scss"],
})
export class ReservationFormComponent {
    isOpen: boolean;
    model: IReservationForm;
    step: number = 1;
    isFoodReserved: boolean;
    bookingAvailable: IBookingAvailable;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.isOpen$.subscribe((isOpen) => {
            this.isOpen = isOpen;
        });
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this.isFoodReserved = this.model["예약유형"] === "식사";
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
        });
    }

    get type(): "식사" | "평상" {
        return this.model["예약유형"];
    }

    get warningFlatTable(): boolean {
        const reservationPerson =
            this.model["평상"] * StandardNumberOfPeople["평상"]["최대인원"] +
            this.model["테이블"] * StandardNumberOfPeople["테이블"];
        return this.model["인원"] > reservationPerson;
    }

    get warningFood(): boolean {
        const reservationPerson =
            (this.model["능이백숙"] + this.model["백숙"] + this.model["버섯찌개"] + this.model["버섯찌개2"]) *
            StandardNumberOfPeople["식사좌석"];
        return this.model["예약유형"] !== "평상" && this.model["인원"] > reservationPerson;
    }

    closeDialog() {
        this.reservationService.isOpen$.next(false);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("예약 내용을 확인해주세요", null, { duration: 2000 });
        } else {
            if (this.step === 1) {
                if (this.model["예약유형"] === "평상") {
                    this._setRecommandFlatTable();
                }
                if (this.model["예약유형"] === "식사") {
                    this.step++;
                }
            }
            if (this.step === 2 && this.model["예약유형"] === "식사") {
                this._setRecommandFood();
            }
            this.reservationService.setReservationForm(this.model);
            this.step++;
            console.warn("onClickNextButton", this.step);
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
                console.warn("적정 인원 대비 평상이 부족합니다", person);
            }
        }
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

    private _checkStep(): boolean {
        if (this.step === 1) {
            return Boolean(this.model["성함"] && this.model["전화번호"] && this.model["인원"]);
        }
        if (this.step === 2) {
            return !this.warningFlatTable;
        }
        if (this.step === 3) {
            return this.model["예약유형"] === "평상" || !this.warningFood;
        }
        return false;
    }

    get carIndexList(): number[] {
        return Array.from({ length: this.model["차량번호"].length }, (_, index) => index);
    }

    updateCarList(value: number) {
        this.model["차량번호"].length += value;
        console.warn("updateCarList", value, this.model["차량번호"]);
    }

    reserve() {
        console.warn("reserve");
        this.closeDialog();
    }

    onClickFlatBench(i: number) {}
}
