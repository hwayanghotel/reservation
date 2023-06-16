import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, shareReplay } from "rxjs";

interface IMonthlyData {
    date: Date;
    content: { text: string; expired: boolean }[];
}

export enum DB_CONTENT {
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

@Injectable({
    providedIn: "root",
})
export class DBService {
    private foodData$!: Observable<any>;
    private flatBenchData$!: Observable<any>;
    constructor(private datePipe: DatePipe, private http: HttpClient) {}

    async getFoodData(date: Date): Promise<any[]> {
        const formatedDate = this.datePipe.transform(date, "yyyy-MM-dd");
        const data = await this._getFoodData("assets/food.json");
        return data.filter((v) => v[0] === formatedDate);
    }

    private _getFoodData(path: string): Promise<[]> {
        return new Promise((resolve) => {
            if (!this.foodData$) {
                this.foodData$ = this.http.get(path).pipe(
                    map((v: any) => v.GoogleSheetData),
                    shareReplay(1)
                );
            }
            this.foodData$.subscribe((v) => resolve(v));
        });
    }

    async getFlatBenchData(date: Date): Promise<any[]> {
        const formatedDate = this.datePipe.transform(date, "yyyy-MM-dd");
        const data = await this._getFlatBenchData("assets/flat-bench.json");
        return data.filter((v) => v[0] === formatedDate);
    }

    private _getFlatBenchData(path: string): Promise<[]> {
        return new Promise((resolve) => {
            if (!this.flatBenchData$) {
                this.flatBenchData$ = this.http.get(path).pipe(
                    map((v: any) => v.GoogleSheetData),
                    shareReplay(1)
                );
            }
            this.flatBenchData$.subscribe((v) => resolve(v));
        });
    }
}
