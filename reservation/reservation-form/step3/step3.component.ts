import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";

@Component({
    selector: "step3",
    templateUrl: "./step3.component.html",
    styleUrls: ["../reservation-form.component.scss"],
})
export class Step3Component {
    model: IReservationForm;
    bookingAvailable: IBookingAvailable;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
        });
    }

    get warningFood(): boolean {
        const foods = this.model["능이백숙"] + this.model["백숙"] + this.model["버섯찌개"] + this.model["버섯찌개2"];
        return (
            this.model["예약유형"] !== "평상" &&
            Math.round(this.model["인원"] / StandardNumberOfPeople["식사좌석"]) > foods
        );
    }

    previousStep() {
        this.reservationService.bookingStep$.next(this.model["예약유형"] === "평상" ? 2 : 1);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("예약 내용을 확인해주세요", null, { duration: 2000 });
        } else {
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(4);
        }
    }

    private _checkStep(): boolean {
        return this.model["예약유형"] === "평상" || !this.warningFood;
    }
}
