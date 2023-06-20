import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

export interface IReservationFormPreData {
    type: "food" | "flat-bench";
    date: string;
    time?: "12:00" | "15:00";
}

@Component({
    selector: "reservation-form",
    templateUrl: "./reservation-form.component.html",
    styleUrls: ["./reservation-form.component.scss"],
})
export class ReservationFormComponent {
    isOpen: boolean;
    model: IReservationForm;
    step: number = 1;
    isFoodReserved: boolean;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.isOpen$.subscribe((isOpen) => {
            this.isOpen = isOpen;
        });
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this.isFoodReserved = this.model["예약유형"] === "식사";
        });
    }

    get type(): "식사" | "평상" {
        return this.model["예약유형"];
    }

    closeDialog() {
        this.reservationService.isOpen$.next(false);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("예약 내용을 정확히 입력해주세요.", null, { duration: 2000 });
        } else {
            this.step++;
        }
    }

    private _checkStep(): boolean {
        if (this.step === 1) {
            return Boolean(this.model["성함"] && this.model["전화번호"] && this.model["인원"]);
        }
        return false;
    }

    reserve() {
        console.warn("reserve");
        this.closeDialog();
    }

    onClickFlatBench(i: number) {}
}
