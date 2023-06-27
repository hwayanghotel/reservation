import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";
import { DialogReservationCancelComponent } from "../dialog-reservation-cancel/dialog-reservation-cancel.component";

@Component({
    selector: "dialog-for-reservation-confirmation",
    templateUrl: "./dialog-for-reservation-confirmation.component.html",
    styleUrls: ["./dialog-for-reservation-confirmation.component.scss", "../reservation-dialog.component.scss"],
})
export class DialogForReservationConfirmationComponent {
    model: IReservationForm;
    reservationCost: number;

    constructor(private reservationService: ReservationService, private dialog: MatDialog) {
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
        this.dialog.open(DialogReservationCancelComponent);
    }
}
