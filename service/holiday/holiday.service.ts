import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HolidayService {
  constructor(private http: HttpClient) {
    this.getHolidays(new Date("2023/5/1"));
  }

  getHolidays(date: Date) {
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
        const items: [] = data.response.body.items.item;
        return items.map((item: any) =>
          Number(item.locdate.toString().substring(6))
        );
      })
    );
  }
}
