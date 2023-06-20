import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DBService } from "reservation/service/DB.service";
import { ReservationService } from "reservation/service/reservation.service";

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
    data: IData[] = [];
    constructor(
        private DBService: DBService,
        private datePipe: DatePipe,
        private reservationService: ReservationService
    ) {
        this.reservationService.setReservationFormPreData({
            type: "flat-bench",
            date: this.datePipe.transform(new Date(), "yyyy-MM-dd") as string,
        });
        this.reservationService.isOpen$.next(true);
    }

    ngOnChanges(changes: SimpleChanges) {
        const previousValue = this.datePipe.transform(changes["date"].previousValue, "yyyy-MM-dd");
        const currentValue = this.datePipe.transform(changes["date"].currentValue, "yyyy-MM-dd");
        if (previousValue !== currentValue) {
            this._setData();
        }
    }

    private async _setData() {
        const MAX_COOK = 14;
        const dataList = await this.DBService.getDailyData("식사", this.datePipe.transform(this.date, "yyyy-MM-dd"));

        this.data = [];

        for (let time of [12, 15]) {
            let cooks: number = 0;
            dataList
                .filter((value) => value["시간"] === time)
                .forEach((value) => {
                    cooks +=
                        Number(value["능이백숙"]) +
                        Number(value["백숙"]) +
                        Number(value["버섯찌개"]) +
                        Number(value["버섯찌개2"]);
                });
            this.data.push({
                expired: cooks >= MAX_COOK,
                text: `${time}시 ${cooks >= MAX_COOK ? "마감" : "가능"}`,
                ratio: `(${cooks}/${MAX_COOK})`,
            });
        }
    }

    openDialog(index: number) {
        this.reservationService.setReservationFormPreData({
            type: "food",
            date: this.datePipe.transform(this.date, "yyyy-MM-dd") as string,
            time: index === 0 ? "12:00" : "15:00",
        });
        this.reservationService.isOpen$.next(true);
    }
}
