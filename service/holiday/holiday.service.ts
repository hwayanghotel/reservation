import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import * as Moment from "moment";

@Injectable({
    providedIn: "root",
})
export class HolidayService {
    constructor(private http: HttpClient) {}

    getHolidays(date: Moment.Moment): Promise<number[]> {
        const index: string = date.format("YYYYMM");
        if (Object.keys(HolidayList).includes(index)) {
            return Promise.resolve(HolidayList[index]);
        }
        return new Promise((resolve) => {
            const weekEnds: number[] = this.getWeekendDates(date);
            this.getHolidaysFromServer(date).subscribe(
                (response) => {
                    const holidaylist: number[] = Array.from(new Set([...weekEnds, ...response])).sort((a, b) => a - b);
                    HolidayList[index] = holidaylist;
                    resolve(Array.from(new Set([...weekEnds, ...response])).sort((a, b) => a - b));
                },
                (error) => {
                    console.error("getHolidys error", error);
                    resolve(weekEnds);
                }
            );
        });
    }

    private getWeekendDates(date: Moment.Moment): number[] {
        const year = date.year();
        const month = date.month();
        const weekendDates: number[] = [];
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendDates.push(date.getDate());
            }
        }

        return weekendDates;
    }

    private getHolidaysFromServer(date: Moment.Moment): Observable<number[]> {
        const solYear = date.format("YYYY");
        const solMonth: string = date.format("MM");
        const ServiceKey = "8b14d5v4Vx8aM3%2Fc43pEI7%2BPz3WY0FRigqDQb10hYDioC9KxGc1SipWlVtGO93OYDIgYwnDGudbs9CglwrDNIQ%3D%3D";
        const url =
            "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=" +
            solYear +
            "&solMonth=" +
            solMonth +
            "&_type=json&ServiceKey=" +
            ServiceKey;

        return this.http.get(url).pipe(
            map((data: any) => {
                const items = data.response.body.items.item;
                if (Array.isArray(items)) {
                    return items.map((item: any) => Number(item.locdate.toString().substring(6)));
                } else if (items) {
                    return [Number(items.locdate.toString().substring(6))];
                } else {
                    return [];
                }
            })
        );
    }
}

const HolidayList: any = {
    "202307": [1, 2, 8, 9, 15, 16, 22, 23, 29, 30],
    "202308": [5, 6, 12, 13, 15, 19, 20, 26, 27],
    "202309": [2, 3, 9, 10, 16, 17, 23, 24, 28, 29, 30],
    "202310": [1, 2, 3, 7, 8, 9, 14, 15, 21, 22, 28, 29],
    "202311": [4, 5, 11, 12, 18, 19, 25, 26],
    "202312": [2, 3, 9, 10, 16, 17, 23, 24, 25, 30, 31],
    "202401": [1, 6, 7, 13, 14, 20, 21, 27, 28],
    "202402": [3, 4, 9, 10, 11, 12, 17, 18, 24, 25],
    "202403": [1, 2, 3, 9, 10, 16, 17, 23, 24, 30, 31],
    "202404": [6, 7, 10, 13, 14, 20, 21, 27, 28],
    "202405": [4, 5, 6, 11, 12, 15, 18, 19, 25, 26],
    "202406": [1, 2, 6, 8, 9, 15, 16, 22, 23, 29, 30],
    "202407": [6, 7, 13, 14, 20, 21, 27, 28],
    "202408": [3, 4, 10, 11, 15, 17, 18, 24, 25, 31],
    "202409": [1, 7, 8, 14, 15, 16, 17, 18, 21, 22, 28, 29],
    "202410": [3, 5, 6, 9, 12, 13, 19, 20, 26, 27],
    "202411": [2, 3, 9, 10, 16, 17, 23, 24, 30],
    "202412": [1, 7, 8, 14, 15, 21, 22, 25, 28, 29],
    "202501": [1, 4, 5, 11, 12, 18, 19, 25, 26, 28, 29, 30],
};
