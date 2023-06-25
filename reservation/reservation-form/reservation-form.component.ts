import { Component } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "reservation-form",
    templateUrl: "./reservation-form.component.html",
    styleUrls: ["./reservation-form.component.scss"],
})
export class ReservationFormComponent {
    model: IReservationForm;
    step: number = 0;

    constructor(private reservationService: ReservationService) {
        this.reservationService.bookingStep$.subscribe((step) => {
            console.warn("??", step);
            this.step = step;
        });
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(undefined);
    }
}
