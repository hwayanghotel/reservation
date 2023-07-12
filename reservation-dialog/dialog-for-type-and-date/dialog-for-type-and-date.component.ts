import { Component } from "@angular/core";
import { ReservationService } from "reservation/service/reservation.service";
import * as Moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ManagerService } from "manager/manager.service";
import { IUserDB } from "reservation/service/DB.service";

@Component({
    selector: "dialog-for-type-and-date",
    templateUrl: "./dialog-for-type-and-date.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForTypeAndDateComponent {
    model: IUserDB;
    timeList: number[] = [10, 11, 12, 13, 14, 15, 16];
    daysList: number[] = [1, 2, 3, 4, 5, 6, 7];
    dateFilter = (date: Moment.Moment): boolean => {
        return date === null || date.format("YYYY-MM-DD") >= Moment().format("YYYY-MM-DD");
    };

    private _date: Moment.Moment = Moment();

    constructor(
        private reservationService: ReservationService,
        private _snackBar: MatSnackBar,
        private managerService: ManagerService
    ) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            this._date = Moment(this.model["예약일"]);
            this._setTimeList();
        });
    }

    get date(): Moment.Moment {
        return this._date;
    }
    set date(value: Moment.Moment) {
        this._date = value;
        this._setTimeList();
    }

    private _setTimeList() {
        this.timeList = [];
        const startHour = this.isToday && new Date().getHours() > 10 ? new Date().getHours() + 1 : 10;
        for (let h = startHour; h < 17; h++) {
            this.timeList.push(h);
        }
    }

    get isToday(): boolean {
        return this._date.format("YYYY-MM-DD") === Moment().format("YYYY-MM-DD");
    }

    closeDialog() {
        this.reservationService.bookingStep$.next(undefined);
    }

    onClickNextButton(step?: number) {
        this.model["예약일"] = this._date.format("YYYY-MM-DD");
        this.model["만료일"] = Moment(this.model["예약일"])
            .add(this.model["이용박수"] ? this.model["이용박수"] : 0, "days")
            .format("YYYY-MM-DD");

        if (!this._checkStep()) {
            this._snackBar.open("빈칸이 있는지 확인해주세요.", null, { duration: 2000 });
        } else {
            this.reservationService.formData$.next(this.model);
            this.reservationService.bookingStep$.next(step ? step : 2);
        }
    }

    get permission(): boolean {
        return this.managerService.permission;
    }

    private _checkStep(): boolean {
        if (this.managerService.permission) {
            return true;
        }
        if (this.model["예약유형"] === "식사") {
            return Boolean(this.model["예약유형"] && this.model["예약일"] && this.model["예약시간"]);
        }
        return Boolean(this.model["예약유형"] && this.model["예약일"]);
    }
}
