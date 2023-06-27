import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "dialog-reservation-cancel",
    templateUrl: "./dialog-reservation-cancel.component.html",
})
export class DialogReservationCancelComponent {
    constructor(
        private reservationService: ReservationService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    cancelButton() {
        this.reservationService.cancel();
        this.dialog.closeAll();
        this._snackBar.open("예약이 취소되었습니다. 다음에 이용해주세요!", null, { duration: 2000 });
    }
}
