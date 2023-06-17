import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DBService, DB_CONTENT } from "reservation/service/DB.service";
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
        private reservationService: ReservationService
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
        const dataList = await this.DBService.getFlatBenchData(this.date);

        this.data = [];

        let flatBench: number = 0;
        let table: number = 0;
        dataList.forEach((value) => {
            flatBench += Number(value[DB_CONTENT.A]);
            table += Number(value[DB_CONTENT.B]);
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
        this.reservationService.setReservationFormPreData({
            type: "flat-bench",
            date: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
        });
        this.reservationService.isOpen$.next(true);
    }
}
