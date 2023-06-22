import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IBookingAvailable, IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step5",
    templateUrl: "./step5.component.html",
    styleUrls: ["../reservation-form.component.scss"],
})
export class Step5Component {
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

    previousStep() {
        this.reservationService.bookingStep$.next(4);
    }

    reserve() {
        this.reservationService.setReservationForm(this.model);
        this.reservationService.reserve();
        this.reservationService.bookingStep$.next(0);
    }
}
