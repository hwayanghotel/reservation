import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "reservation-form",
    templateUrl: "./reservation-form.component.html",
    styleUrls: ["./reservation-form.component.scss"],
})
export class ReservationFormComponent {
    model: IReservationForm;
    step: number = 0;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.bookingStep$.subscribe((step) => {
            this.step = step;
        });
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(0);
    }
}
