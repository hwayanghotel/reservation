import { Component } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step7",
    templateUrl: "./step7.component.html",
    styleUrls: ["./step7.component.scss", "../reservation-form.component.scss"],
})
export class Step7Component {
    model: IReservationForm;
    constructor(private reservationService: ReservationService) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(undefined);
    }

    onSearchButton() {
        console.warn("onSearchButton");
    }
}
