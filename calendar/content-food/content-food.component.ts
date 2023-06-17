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
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const previousValue = this.datePipe.transform(changes["date"].previousValue, "yyyy-MM-dd");
        const currentValue = this.datePipe.transform(changes["date"].currentValue, "yyyy-MM-dd");
        if (previousValue !== currentValue) {
            this._setData();
        }
    }

    private async _setData() {
        const MAX_COOK = 14;
        const dataList = await this.DBService.getFoodData(this.date);

        this.data = [];

        for (let time of [12, 15]) {
            let cooks: number = 0;
            dataList
                .filter((value) => value[DB_CONTENT.time] === `${time}:00`)
                .forEach((value) => {
                    cooks +=
                        Number(value[DB_CONTENT.A]) +
                        Number(value[DB_CONTENT.B]) +
                        Number(value[DB_CONTENT.C]) +
                        Number(value[DB_CONTENT.D]);
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
