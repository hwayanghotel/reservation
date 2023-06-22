import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IBookingAvailable, IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step4",
    templateUrl: "./step4.component.html",
    styleUrls: ["../reservation-form.component.scss"],
})
export class Step4Component {
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

    get carIndexList(): number[] {
        return Array.from({ length: this.model["차량번호"].length }, (_, index) => index);
    }

    updateCarList(value: number) {
        this.model["차량번호"].length += value;
        console.warn("updateCarList", value, this.model["차량번호"]);
    }

    previousStep() {
        this.reservationService.bookingStep$.next(3);
    }

    onClickNextButton() {
        this.reservationService.setReservationForm(this.model);
        this.reservationService.bookingStep$.next(5);
    }
}
