import { Component } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";
import * as Moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: "input-info-dialog",
    templateUrl: "./input-info-dialog.component.html",
    styleUrls: ["../../reservation-dialog/reservation-dialog.component.scss"],
})
export class InputInfoDialogComponent {
    model: IReservationForm;
    formControlName = new FormControl("", [Validators.required]);
    date: Moment.Moment;
    dateFilter = (date: Date | null): boolean => date >= this._today;
    private _today: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((v) => {
            this.model = v;
        });
    }

    search() {
        if (this._checkStep()) {
            if (this.date) {
                this.model["날짜"] = this.date.format("YYYY-MM-DD");
            }
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(2);
        } else {
            this._snackBar.open("예약자 성함과 전화번호를 입력해주세요.", null, { duration: 2000 });
        }
    }

    private _checkStep(): boolean {
        return Boolean(this.model["성함"] && this.model["전화번호"]);
    }
}
