import { Injectable } from "@angular/core";

interface IMonthlyData {
  date: Date;
  content: { text: string; expired: boolean }[];
}

@Injectable({
  providedIn: "root",
})
export class DBService {
  constructor() {}
  getMonthlyData(date: Date): Promise<IMonthlyData[]> {
    return new Promise((resolve) => {
      resolve(
        MonthlyData.filter(
          (data) =>
            data.date.getFullYear() === date.getFullYear() &&
            data.date.getMonth() === date.getMonth() &&
            data.date.getDate() >= date.getDate()
        )
      );
    });
  }
}

const MonthlyData = [
  {
    date: new Date("2023/5/3"),
    content: [
      { text: "평상 마감(6/6)", expired: true },
      { text: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/6/1"),
    content: [
      { text: "평상 마감(6/6)", expired: true },
      { text: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/6/20"),
    content: [
      { text: "평상 마감(6/6)", expired: true },
      { text: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/6/21"),
    content: [
      { text: "평상 마감(6/6)", expired: true },
      { text: "테이블 가능(2/6)", expired: false },
    ],
  },
  {
    date: new Date("2023/6/22"),
    content: [
      { text: "평상 가능(3/6)", expired: false },
      { text: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/7/1"),
    content: [
      { text: "평상 가능(0/6)", expired: false },
      { text: "테이블 가능(1/6)", expired: false },
    ],
  },
];
