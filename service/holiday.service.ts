import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HolidayService {
  constructor(private http: HttpClient) {}

  getHolidays(date: Date): Promise<number[]> {
    const weekEnds: number[] = this.getWeekendDates(date);

    return new Promise((resolve) => {
      this.getHolidaysFromServer(date).subscribe(
        (response) => {
          resolve(
            Array.from(new Set([...weekEnds, ...response])).sort(
              (a, b) => a - b
            )
          );
        },
        (error) => {
          console.error("getHolidys error", error);
          resolve(weekEnds);
        }
      );
    });
  }

  private getWeekendDates(date: Date): number[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekendDates: number[] = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDates.push(date.getDate());
      }
    }

    return weekendDates;
  }

  private getHolidaysFromServer(date: Date): Observable<number[]> {
    // date = new Date("2023/5/1");
    const solYear = date.getFullYear().toString();
    const solMonth: string =
      date.getMonth() < 9
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1).toString();
    const ServiceKey =
      "8b14d5v4Vx8aM3%2Fc43pEI7%2BPz3WY0FRigqDQb10hYDioC9KxGc1SipWlVtGO93OYDIgYwnDGudbs9CglwrDNIQ%3D%3D";
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
          return items.map((item: any) =>
            Number(item.locdate.toString().substring(6))
          );
        } else {
          return [Number(items.locdate.toString().substring(6))];
        }
      })
    );
  }
}
