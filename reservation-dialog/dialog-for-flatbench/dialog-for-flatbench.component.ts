import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";

@Component({
    selector: "dialog-for-flatbench",
    templateUrl: "./dialog-for-flatbench.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForFlatbenchComponent {
    model: IReservationForm;
    bookingAvailable: IBookingAvailable;

    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this._setRecommandFlatTable();
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
        });
    }

    private _setRecommandFlatTable() {
        if (!this.model["평상"] && !this.model["테이블"]) {
            let person: number = this.model["인원"];
            this.model["평상"] = Math.round(person / StandardNumberOfPeople["평상"]["적정인원"]);
            if (this.model["평상"] > this.bookingAvailable["잔여평상"]) {
                this.model["평상"] = this.bookingAvailable["잔여평상"];
                person -= this.model["평상"] * StandardNumberOfPeople["평상"]["적정인원"];
                this.model["테이블"] = Math.round(person / StandardNumberOfPeople["테이블"]);
                if (this.model["테이블"] > this.bookingAvailable["잔여테이블"]) {
                    this.model["테이블"] = this.bookingAvailable["잔여테이블"];
                    person -= this.model["테이블"] * StandardNumberOfPeople["테이블"];
                    console.warn("적정 인원 대비 평상이 부족합니다", person);
                }
            }
        }
    }

    get flatBench(): number {
        return this.model["평상"];
    }
    set flatBench(value: number) {
        this.model["평상"] = value > 0 ? value : 0;
    }

    get table(): number {
        return this.model["테이블"];
    }
    set table(value: number) {
        this.model["테이블"] = value > 0 ? value : 0;
    }

    get reservationCost(): number {
        return this.reservationService.getReservationCost(this.model);
    }

    get warning(): boolean {
        const reservationPerson =
            this.model["평상"] * StandardNumberOfPeople["평상"]["최대인원"] +
            this.model["테이블"] * StandardNumberOfPeople["테이블"];
        return this.model["인원"] > reservationPerson;
    }

    previousStep() {
        this.reservationService.bookingStep$.next(2);
    }

    onClickNextButton() {
        if (this.warning) {
            this._snackBar.open("입력된 평상 정보를 확인해주세요.", null, { duration: 2000 });
        } else {
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(4);
        }
    }
}
