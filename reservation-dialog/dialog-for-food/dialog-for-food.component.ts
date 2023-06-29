import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ManagerService } from "manager/manager.service";
import {
    IBookingAvailable,
    IReservationForm,
    ReservationService,
    StandardNumberOfPeople,
} from "reservation/service/reservation.service";
import { Price } from "src/assets/price";

@Component({
    selector: "dialog-for-food",
    templateUrl: "./dialog-for-food.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForFoodComponent {
    model: IReservationForm;
    bookingAvailable: IBookingAvailable;
    Price = Price;

    constructor(
        private reservationService: ReservationService,
        private _snackBar: MatSnackBar,
        private managerService: ManagerService
    ) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            if (this.bookingAvailable) {
                this._setRecommandFood();
            }
        });
        this.reservationService.bookingAvailable$.subscribe((data) => {
            this.bookingAvailable = data;
            if (this.model) {
                this._setRecommandFood();
            }
        });
    }

    private _setRecommandFood() {
        if (this.model["예약유형"] === "평상") return;
        const foods: number =
            this.model["능이백숙"] + this.model["백숙"] + this.model["버섯찌개"] + this.model["버섯찌개2"];
        if (!foods) {
            let person: number = this.model["인원"];
            this.model["능이백숙"] = Math.round(person / StandardNumberOfPeople["식사좌석"]);
            if (this.model["능이백숙"] > this.bookingAvailable["잔여백숙"]) {
                this.model["능이백숙"] = this.bookingAvailable["잔여백숙"];
                person -= this.model["능이백숙"] * StandardNumberOfPeople["식사좌석"];
                this.model["버섯찌개"] = Math.round(person / StandardNumberOfPeople["식사좌석"]);
                if (this.model["버섯찌개"] > this.bookingAvailable["잔여버섯"]) {
                    this.model["버섯찌개"] = this.bookingAvailable["잔여버섯"];
                    person -= this.model["버섯찌개"] * StandardNumberOfPeople["식사좌석"];
                    console.warn("적정 인원 대비 식사가 부족합니다", person);
                }
            }
        }
    }

    get nyBaeksuk(): number {
        return this.model["능이백숙"];
    }
    set nyBaeksuk(value: number) {
        this.model["능이백숙"] = value > 0 ? value : 0;
    }

    get baeksuk(): number {
        return this.model["백숙"];
    }
    set baeksuk(value: number) {
        this.model["백숙"] = value > 0 ? value : 0;
    }

    get mushroomStew(): number {
        return this.model["버섯찌개"];
    }
    set mushroomStew(value: number) {
        this.model["버섯찌개"] = value > 0 ? value : 0;
    }

    get mushroomStew2(): number {
        return this.model["버섯찌개2"];
    }
    set mushroomStew2(value: number) {
        this.model["버섯찌개2"] = value > 0 ? value : 0;
    }

    get reservationCost(): number {
        return this.reservationService.getReservationCost(this.model);
    }

    get warning(): boolean {
        const foods = this.model["능이백숙"] + this.model["백숙"] + this.model["버섯찌개"] + this.model["버섯찌개2"];
        return (
            this.model["예약유형"] !== "평상" &&
            Math.round(this.model["인원"] / StandardNumberOfPeople["식사좌석"]) > foods
        );
    }

    previousStep() {
        this.reservationService.bookingStep$.next(this.model["예약유형"] === "평상" ? 3 : 2);
    }

    onClickNextButton() {
        if (!this._checkStep()) {
            this._snackBar.open("입력된 식사 정보를 확인해주세요", null, { duration: 2000 });
        } else {
            this.reservationService.setReservationForm(this.model);
            this.reservationService.bookingStep$.next(5);
        }
    }

    private _checkStep(): boolean {
        if (this.managerService.permission || this.model["예약유형"] === "객실") {
            return true;
        }
        return this.model["예약유형"] === "평상" || !this.warning;
    }
}
