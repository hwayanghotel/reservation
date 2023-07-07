import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";
import { DBService } from "reservation/service/DB.service";
import { MAX_RESERVATION, ReservationService } from "reservation/service/reservation.service";

interface IData {
    text: string;
    ratio: string;
    expired: boolean;
}

@Component({
    selector: "content-food",
    templateUrl: "./content-food.component.html",
    styleUrls: ["./content-food.component.scss"],
})
export class ContentFoodComponent implements OnChanges {
    @Input() date!: Date;
    data: IData = {
        text: "",
        ratio: "",
        expired: false,
    };
    private _calenderDB: any;
    constructor(
        private DBService: DBService,
        private datePipe: DatePipe,
        private reservationService: ReservationService,
        private dialog: MatDialog
    ) {
        this.DBService.calendarDB$.subscribe((calenderDB) => {
            this._calenderDB = calenderDB;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const previousValue = this.datePipe.transform(changes["date"].previousValue, "yyyy-MM-dd");
        const currentValue = this.datePipe.transform(changes["date"].currentValue, "yyyy-MM-dd");
        if (previousValue !== currentValue) {
            this._setData();
        }
    }

    private async _setData() {
        let cooks: number = 0;
        try {
            const today = this.datePipe.transform(this.date, "yyyy-MM-dd");
            cooks = this._calenderDB[today.slice(0, 7)][today].food;
            cooks = cooks ? cooks : 0;
        } catch {
            cooks = 0;
        }

        this.data = {
            expired: cooks >= MAX_RESERVATION["식사자리"],
            text: `식사 ${cooks >= MAX_RESERVATION["식사자리"] ? "마감" : ""}`,
            ratio: `(${cooks}/${MAX_RESERVATION["식사자리"]})`,
        };
    }

    openDialog() {
        this.reservationService.formData$.next({
            예약유형: "식사",
            예약일: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
            상태: "대기",
        });
        this.reservationService.bookingStep$.next(1);
        this.dialog.open(ReservationDialogComponent);
    }
}
