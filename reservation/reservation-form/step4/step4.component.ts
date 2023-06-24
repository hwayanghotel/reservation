import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IBookingAvailable, IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step4",
    templateUrl: "./step4.component.html",
    styleUrls: ["step4.component.scss", "../reservation-form.component.scss"],
})
export class Step4Component {
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

    get carIndexList(): number[] {
        return Array.from({ length: this.model["차량번호"].length }, (_, index) => index);
    }

    cannotAddForm(): boolean {
        //조건1: 총 주차대수 여유있어야 함
        //조건2: 주문 한도를 넘으면 안 됌
        const availableCars =
            this.model["능이백숙"] +
            this.model["백숙"] +
            this.model["버섯찌개"] +
            this.model["버섯찌개2"] +
            2 * (this.model["평상"] + this.model["테이블"]);
        return (
            this.carIndexList.length >= availableCars || this.carIndexList.length >= this.bookingAvailable["잔여주차"]
        );
    }

    addForm() {
        this.model["차량번호"].length++;
    }

    deleteForm(index: number) {
        this.model["차량번호"].splice(index, 1);
    }

    updateCarList(value: number) {
        this.model["차량번호"].length += value;
        console.warn("updateCarList", value, this.model["차량번호"]);
    }

    previousStep() {
        this.reservationService.bookingStep$.next(3);
    }

    onClickNextButton() {
        this.model["차량번호"] = this.model["차량번호"].filter((v) => v);
        this.reservationService.setReservationForm(this.model);
        this.reservationService.bookingStep$.next(5);
    }
}
