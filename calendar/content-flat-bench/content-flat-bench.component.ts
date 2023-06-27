import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";
import { DBService } from "reservation/service/DB.service";
import { ReservationService } from "reservation/service/reservation.service";

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
    constructor(
        private DBService: DBService,
        private datePipe: DatePipe,
        private reservationService: ReservationService,
        private dialog: MatDialog
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const previousValue = this.datePipe.transform(changes["date"].previousValue, "yyyy-MM-dd");
        const currentValue = this.datePipe.transform(changes["date"].currentValue, "yyyy-MM-dd");
        if (previousValue !== currentValue) {
            this._setData();
        }
    }

    private async _setData() {
        const MAX_NUM = 6;
        const dataList = await this.DBService.getDailyData("평상", this.datePipe.transform(this.date, "yyyy-MM-dd"));

        this.data = [];

        let flatBench: number = 0;
        let table: number = 0;
        dataList.forEach((value) => {
            flatBench += value["평상"];
            table += value["테이블"];
        });
        this.data.push({
            expired: flatBench >= MAX_NUM,
            text: `평상 ${flatBench >= MAX_NUM ? "마감" : "가능"}`,
            ratio: `(${flatBench}/${MAX_NUM})`,
        });
        this.data.push({
            expired: table >= MAX_NUM,
            text: `데크 ${table >= MAX_NUM ? "마감" : "가능"}`,
            ratio: `(${table}/${MAX_NUM})`,
        });
    }

    openDialog() {
        this.reservationService.setReservationForm({
            예약유형: "평상",
            날짜: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
            상태: "대기중",
        });
        this.reservationService.bookingStep$.next(1);
        this.dialog.open(ReservationDialogComponent);
    }
}
