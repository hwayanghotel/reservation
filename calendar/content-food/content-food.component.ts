import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DBService } from "reservation/service/DB.service";

interface IData {
    text: string;
    ratio: string;
    expired: boolean;
}

enum Food {
    "date",
    "time",
    "link",
    "name",
    "person",
    "A",
    "B",
    "C",
    "D",
    "tel",
    "car",
    "note",
}

@Component({
    selector: "content-food",
    templateUrl: "./content-food.component.html",
    styleUrls: ["./content-food.component.scss"],
})
export class ContentFoodComponent implements OnChanges {
    @Input() date!: Date;
    data: IData[] = [];
    constructor(private DBService: DBService, private datePipe: DatePipe) {}

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

        for (let time of [12, 15]) {
            let cooks: number = 0;
            dataList
                .filter((value) => value[Food.time] === `${time}:00`)
                .forEach((value) => {
                    cooks +=
                        Number(value[Food.A]) + Number(value[Food.B]) + Number(value[Food.C]) + Number(value[Food.D]);
                });
            this.data.push({
                expired: cooks >= MAX_COOK,
                text: `${time}시 ${cooks >= MAX_COOK ? "마감" : "가능"}`,
                ratio: `(${cooks}/${MAX_COOK})`,
            });
        }
    }
}
