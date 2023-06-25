import { Component } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step6",
    templateUrl: "./step6.component.html",
    styleUrls: ["./step6.component.scss", "../reservation-form.component.scss"],
})
export class Step6Component {
    model: IReservationForm;
    reservationCost: number;

    constructor(private reservationService: ReservationService) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this.reservationCost = this.reservationService.getReservationCost(data);
        });
    }

    get reservationCheckUser(): boolean {
        return this.reservationService.reservationCheckUser;
    }

    okButton() {
        this.reservationService.bookingStep$.next(undefined);
    }

    editButton() {
        this.reservationService.bookingStep$.next(1);
    }

    cancelButton() {
        this.reservationService.cancel();
    }
}
