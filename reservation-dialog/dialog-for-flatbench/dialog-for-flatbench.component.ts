import { Component, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ManagerService } from "manager/manager.service";
import { DBService, IUserDB } from "reservation/service/DB.service";
import { MAX_RESERVATION, ReservationService, StandardNumberOfPeople } from "reservation/service/reservation.service";
import { Subscription } from "rxjs";
import * as Moment from "moment";

@Component({
    selector: "dialog-for-flatbench",
    templateUrl: "./dialog-for-flatbench.component.html",
    styleUrls: ["../reservation-dialog.component.scss"],
})
export class DialogForFlatbenchComponent implements OnDestroy {
    model: IUserDB;
    bookingAvailable: { 잔여평상: number; 잔여데크: number };

    private subs: Subscription[] = [];
    constructor(
        private reservationService: ReservationService,
        private DBService: DBService,
        private _snackBar: MatSnackBar,
        private managerService: ManagerService
    ) {
        this.subs.push(
            this.reservationService.formData$.subscribe((data) => {
                this.model = data;
                if (!this.bookingAvailable) {
                    this.subs.push(
                        this.DBService.calendarDB$.subscribe((calenderDB) => {
                            let flatBench: number = 0;
                            let table: number = 0;
                            try {
                                flatBench = calenderDB[Moment(this.model["예약일"]).format("YYMM")][Moment(this.model["예약일"]).format("YYMMDD")].flatBench;
                                flatBench = flatBench ? flatBench : 0;
                            } catch {
                                flatBench = 0;
                            }
                            try {
                                table = calenderDB[Moment(this.model["예약일"]).format("YYMM")][Moment(this.model["예약일"]).format("YYMMDD")].table;
                                table = table ? table : 0;
                            } catch {
                                table = 0;
                            }
                            this.bookingAvailable = {
                                잔여평상: MAX_RESERVATION["평상"] - flatBench,
                                잔여데크: MAX_RESERVATION["데크"] - table,
                            };
                            if (!this.permission) {
                                this._setRecommandFlatTable();
                            }
                        })
                    );
                }
            })
        );
    }

    private _setRecommandFlatTable() {
        if (!this.model["평상"] && !this.model["데크"]) {
            let person: number = this.model["인원"];
            this.model["평상"] = Math.round(person / StandardNumberOfPeople["평상"]["적정인원"]);
            if (this.model["평상"] > this.bookingAvailable["잔여평상"]) {
                this.model["평상"] = this.bookingAvailable["잔여평상"];
                person -= this.model["평상"] * StandardNumberOfPeople["평상"]["적정인원"];
                this.model["데크"] = Math.round(person / StandardNumberOfPeople["데크"]);
                if (this.model["데크"] > this.bookingAvailable["잔여데크"]) {
                    this.model["데크"] = this.bookingAvailable["잔여데크"];
                    person -= this.model["데크"] * StandardNumberOfPeople["데크"];
                    console.warn("적정 인원 대비 평상이 부족합니다", person);
                }
            }
        }
    }

    get flatBench(): number {
        return this.model["평상"] || 0;
    }
    set flatBench(value: number) {
        this.model["평상"] = value || 0;
    }

    get table(): number {
        return this.model["데크"] || 0;
    }
    set table(value: number) {
        this.model["데크"] = value || 0;
    }

    get reservationCost(): number {
        return this.reservationService.getReservationCost(this.model);
    }

    get warning(): boolean {
        if (this.permission) {
            return false;
        }
        const reservationPerson = this.flatBench * StandardNumberOfPeople["평상"]["최대인원"] + this.table * StandardNumberOfPeople["데크"];
        return this.model["인원"] > reservationPerson;
    }

    get permission(): boolean {
        return this.managerService.permission;
    }

    previousStep() {
        this.reservationService.bookingStep$.next(2);
    }

    onClickNextButton(step?: number) {
        if (this.warning) {
            this._snackBar.open("입력된 평상 정보를 확인해주세요.", null, { duration: 2000 });
        } else {
            this.reservationService.formData$.next(this.model);
            this.reservationService.bookingStep$.next(step ? step : 4);
        }
    }

    ngOnDestroy() {
        this.subs.forEach((sub) => sub.unsubscribe());
    }
}
