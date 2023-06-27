import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "dialog-for-customer-info",
    templateUrl: "./dialog-for-customer-info.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForCustomerInfoComponent {
    model: IReservationForm;
    formControlName = new FormControl("", [Validators.required]);
    formControlPerson = new FormControl("", [Validators.required]);

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
    }

    previousStep() {
        this.reservationService.bookingStep$.next(1);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("입력된 정보가 올바른지 확인해주세요.", null, { duration: 2000 });
        } else {
            let step: number;
            if (this.model["예약유형"] === "평상") {
                step = 3;
            }
            if (this.model["예약유형"] === "식사") {
                step = 4;
            }
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(step);
        }
    }

    private _checkStep(): boolean {
        return Boolean(this.model["성함"] && this.model["전화번호"] && this.model["인원"]);
    }
}
