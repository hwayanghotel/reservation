import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ManagerService } from "manager/manager.service";
import { IUserDB } from "reservation/service/DB.service";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "dialog-for-customer-info",
    templateUrl: "./dialog-for-customer-info.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForCustomerInfoComponent {
    model: IUserDB;
    formControlName = new FormControl("", [Validators.required]);
    formControlPerson = new FormControl("", [Validators.required]);
    formControlMiddleNumber = new FormControl("", [Validators.required]);
    formControlLastNumber = new FormControl("", [Validators.required]);

    firstNumber: string = "010";
    middleNumber: string = "";
    lastNumber: string = "";

    constructor(
        private reservationService: ReservationService,
        private _snackBar: MatSnackBar,
        private managerService: ManagerService
    ) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            if (!this.model["인원"]) {
                this.model["인원"] = 0;
            }
            if (this.model["전화번호"]) {
                this.firstNumber = this.model["전화번호"].split("-")[0];
                this.middleNumber = this.model["전화번호"].split("-")[1];
                this.lastNumber = this.model["전화번호"].split("-")[2];
            }
        });
    }

    previousStep() {
        this.reservationService.bookingStep$.next(1);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("예약 필수 정보를 적어주세요.", null, { duration: 2000 });
        } else {
            this.model["전화번호"] = `${this.firstNumber}-${this.middleNumber}-${this.lastNumber}`;
            this.reservationService.formData$.next(this.model);
            this.reservationService.bookingStep$.next(3 + Number(["식사", "객실"].includes(this.model["예약유형"])));
        }
    }

    private _checkStep(): boolean {
        if (this.managerService.permission) {
            return true;
        }
        return Boolean(
            this.model["성함"] &&
                this.firstNumber &&
                this.middleNumber.length === 4 &&
                this.lastNumber.length === 4 &&
                this.model["인원"]
        );
    }
}
