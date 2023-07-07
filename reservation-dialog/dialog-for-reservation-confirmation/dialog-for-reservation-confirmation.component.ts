import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReservationService } from "reservation/service/reservation.service";
import { DialogReservationCancelComponent } from "../dialog-reservation-cancel/dialog-reservation-cancel.component";
import { IUserDB } from "reservation/service/DB.service";
import * as Moment from "moment";

@Component({
    selector: "dialog-for-reservation-confirmation",
    templateUrl: "./dialog-for-reservation-confirmation.component.html",
    styleUrls: ["./dialog-for-reservation-confirmation.component.scss", "../reservation-dialog.component.scss"],
})
export class DialogForReservationConfirmationComponent {
    model: IUserDB;
    reservationCost: number;
    showTodayInfo: boolean;

    constructor(private reservationService: ReservationService, private dialog: MatDialog) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this.reservationCost = this.reservationService.getReservationCost(data);
            this.showTodayInfo =
                this.model["예약일"] === Moment().format("YY-M-D") && ["대기", "수정"].includes(data["상태"]);
        });
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
        this.dialog.open(DialogReservationCancelComponent, { data: this.model });
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
