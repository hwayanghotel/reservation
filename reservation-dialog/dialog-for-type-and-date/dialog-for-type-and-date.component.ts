import { Component } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";
import * as Moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "dialog-for-type-and-date",
    templateUrl: "./dialog-for-type-and-date.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForTypeAndDateComponent {
    model: IReservationForm;
    date: Moment.Moment;
    dateFilter = (date: Date | null): boolean => date >= this._today;
    private _today: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this.date = Moment(this.model["날짜"]);
        });
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(undefined);
    }

    onClickNextButton() {
        this.model["날짜"] = this.date.format("YYYY-MM-DD");

        if (!this._checkStep()) {
            this._snackBar.open("입력된 정보가 올바른지 확인해주세요.", null, { duration: 2000 });
        } else {
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(2);
        }
    }

    private _checkStep(): boolean {
        return Boolean(this.model["예약유형"] && this.model["날짜"] && this.model["시간"]);
    }
}
