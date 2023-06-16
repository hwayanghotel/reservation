import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, shareReplay } from "rxjs";

interface IMonthlyData {
    date: Date;
    content: { text: string; expired: boolean }[];
}

@Injectable({
    providedIn: "root",
})
export class DBService {
    private data$!: Observable<any>;
    constructor(private datePipe: DatePipe, private http: HttpClient) {}

    async getFoodData(date: Date): Promise<any[]> {
        const formatedDate = this.datePipe.transform(date, "yyyy-MM-dd");
        const data = await this._getData();
        return data.filter((v) => v[0] === formatedDate);
    }

    private _getData(): Promise<[]> {
        return new Promise((resolve) => {
            if (!this.data$) {
                this.data$ = this.http.get("assets/food.json").pipe(
                    map((v: any) => v.GoogleSheetData),
                    shareReplay(1)
                );
            }
            this.data$.subscribe((v) => resolve(v));
        });
    }
}
