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
    selector: "content-flat-bench",
    templateUrl: "./content-flat-bench.component.html",
    styleUrls: ["./content-flat-bench.component.scss"],
})
export class ContentFlatBenchComponent implements OnChanges {
    @Input() date!: Date;
    data: IData[] = [];
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
        let flatBench: number = 0;
        let table: number = 0;

        const today = this.datePipe.transform(this.date, "yyyy-MM-dd");
        try {
            flatBench = this._calenderDB[today.slice(0, 7)][today].flatBench;
            flatBench = flatBench ? flatBench : 0;
        } catch {
            flatBench = 0;
        }
        try {
            table = this._calenderDB[today.slice(0, 7)][today].table;
            table = table ? table : 0;
        } catch {
            table = 0;
        }

        this.data.push({
            expired: flatBench >= MAX_RESERVATION["평상"],
            text: `평상 ${flatBench >= MAX_RESERVATION["평상"] ? "마감" : ""}`,
            ratio: `(${flatBench}/${MAX_RESERVATION["평상"]})`,
        });
        this.data.push({
            expired: table >= MAX_RESERVATION["테이블"],
            text: `데크 ${table >= MAX_RESERVATION["테이블"] ? "마감" : ""}`,
            ratio: `(${table}/${MAX_RESERVATION["테이블"]})`,
        });
    }

    openDialog() {
        this.reservationService.formData$.next({
            ...this.reservationService.formData$.getValue(),
            예약유형: "평상",
            예약일: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
            상태: "대기",
        });
        this.reservationService.bookingStep$.next(1);
        this.dialog.open(ReservationDialogComponent);
    }
}
