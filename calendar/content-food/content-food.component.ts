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
        const dataList = await this.DBService.getDailyData("식사", this.datePipe.transform(this.date, "yyyy-MM-dd"));

        let cooks: number = 0;
        dataList
            .filter((value) => !["대기", "수정", "취소"].includes(value["상태"]))
            .forEach((value) => {
                cooks +=
                    Number(value["능이백숙"]) +
                    Number(value["백숙"]) +
                    Number(value["버섯찌개"]) +
                    Number(value["버섯찌개2"]);
            });
        this.data = {
            expired: cooks >= MAX_RESERVATION["식사자리"],
            text: `식사 ${cooks >= MAX_RESERVATION["식사자리"] ? "마감" : ""}`,
            ratio: `(${cooks}/${MAX_RESERVATION["식사자리"]})`,
        };
    }

    openDialog() {
        this.reservationService.formData$.next({
            예약유형: "식사",
            날짜: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
            상태: "대기",
        });
        this.reservationService.bookingStep$.next(1);
        this.dialog.open(ReservationDialogComponent);
    }
}
