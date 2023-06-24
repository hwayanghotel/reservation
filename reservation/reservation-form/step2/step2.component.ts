import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";

@Component({
    selector: "step2",
    templateUrl: "./step2.component.html",
    styleUrls: ["../reservation-form.component.scss"],
})
export class Step2Component {
    model: IReservationForm;
    bookingAvailable: IBookingAvailable;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
        });
    }

    get reservationCost(): number {
        return this.reservationService.getReservationCost(this.model);
    }

    get warningFlatTable(): boolean {
        const reservationPerson =
            this.model["평상"] * StandardNumberOfPeople["평상"]["최대인원"] +
            this.model["테이블"] * StandardNumberOfPeople["테이블"];
        return this.model["인원"] > reservationPerson;
    }

    previousStep() {
        this.reservationService.bookingStep$.next(1);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("입력된 평상 정보를 확인해주세요.", null, { duration: 2000 });
        } else {
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(3);
        }
    }

    private _checkStep(): boolean {
        return !this.warningFlatTable;
    }
}
