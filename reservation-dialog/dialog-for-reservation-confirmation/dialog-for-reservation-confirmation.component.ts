import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReservationService } from "reservation/service/reservation.service";
import { DialogReservationCancelComponent } from "../dialog-reservation-cancel/dialog-reservation-cancel.component";
import { IDBService } from "reservation/service/DB.service";

@Component({
    selector: "dialog-for-reservation-confirmation",
    templateUrl: "./dialog-for-reservation-confirmation.component.html",
    styleUrls: ["./dialog-for-reservation-confirmation.component.scss", "../reservation-dialog.component.scss"],
})
export class DialogForReservationConfirmationComponent {
    model: IDBService;
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

    moveToCarNum() {
        this.reservationService.bookingStep$.next(5);
    }

    editButton() {
        this.reservationService.bookingStep$.next(1);
    }

    cancelButton() {
        this.dialog.open(DialogReservationCancelComponent);
    }

    showReservationRule(): boolean {
        return ["대기", "예약", "수정"].includes(this.model["상태"]);
    }

    serviceLink(): string {
        let uri = "https://hwayanghotel.github.io/#/";
        if (this.model["예약유형"] === "평상") {
            return "https://hwayanghotel.github.io/#/flat-bench";
        }
        if (this.model["예약유형"] === "식사") {
            return "https://hwayanghotel.github.io/#/food";
        }
        return (uri += "room");
    }
}
