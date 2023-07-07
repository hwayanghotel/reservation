import { Component } from "@angular/core";
import { ReservationService } from "reservation/service/reservation.service";
import * as Moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, Validators } from "@angular/forms";
import { IUserDB } from "reservation/service/DB.service";

@Component({
    selector: "input-info-dialog",
    templateUrl: "./input-info-dialog.component.html",
    styleUrls: ["../../reservation-dialog/reservation-dialog.component.scss"],
})
export class InputInfoDialogComponent {
    model: IUserDB;
    formControlName = new FormControl("", [Validators.required]);
    formControlMiddleNumber = new FormControl("", [Validators.required]);
    formControlLastNumber = new FormControl("", [Validators.required]);

    firstNumber: string = "010";
    middleNumber: string = "";
    lastNumber: string = "";
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
            this.model["전화번호"] = `${this.firstNumber}-${this.middleNumber}-${this.lastNumber}`;
            if (this.date) {
                this.model["예약일"] = this.date.format("YYYY-MM-DD");
            }
            this.reservationService.formData$.next(this.model);
            this.reservationService.bookingStep$.next(2);
        } else {
            this._snackBar.open("예약자 성함과 전화번호를 입력해주세요.", null, { duration: 2000 });
        }
    }

    private _checkStep(): boolean {
        return Boolean(
            this.model["성함"] && this.firstNumber && this.middleNumber.length === 4 && this.lastNumber.length === 4
        );
    }
}
