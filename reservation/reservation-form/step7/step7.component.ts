import { Component } from "@angular/core";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "step7",
    templateUrl: "./step7.component.html",
    styleUrls: ["./step7.component.scss", "../reservation-form.component.scss"],
})
export class Step7Component {
    selected: any;
    model: {
        예약유형: "평상" | "식사";
        성함: string;
        전화번호: string;
        날짜: string;
    } = {
        예약유형: undefined,
        성함: undefined,
        전화번호: undefined,
        날짜: undefined,
    };
    constructor(private reservationService: ReservationService, private _snackBar: MatSnackBar) {}
    private today: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    dateFilter = (date: Date | null): boolean => {
        return date >= this.today;
    };

    setType(type: "평상" | "식사") {
        this.model["예약유형"] = type;
        console.warn("setType", this.model);
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(undefined);
    }

    async onSearchButton() {
        console.warn("onSearchButton");

        const list = await this.reservationService.search(this.model);
        if (list.length === 0) {
            this._snackBar.open("일치하는 고객 정보가 없습니다. 다시 확인해주세요.", null, { duration: 2000 });
        }
        if (list.length === 1) {
            this._snackBar.open("일치하는 고객 정보로 이동합니다.", null, { duration: 2000 });
            this.reservationService.setReservationForm(list[0]);
            this.reservationService.bookingStep$.next(6);
            this.reservationService.reservationCheckUser = true;
        }
        if (list.length > 1) {
            console.warn("일치하는 고객이 여러명입니다. 다시 확인해주세요.");
        }
    }

    dateChange(event: MatDatepickerInputEvent<Date>) {
        console.warn(event.value);
    }
}
