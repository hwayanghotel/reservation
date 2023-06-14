import { Component } from "@angular/core";

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
  constructor() {}
}

const MonthlyData = [
  {
    date: new Date("2023/6/20"),
    contents: [
      { name: "평상 마감(6/6)", expired: true },
      { name: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/6/21"),
    contents: [
      { name: "평상 마감(6/6)", expired: true },
      { name: "테이블 가능(2/6)", expired: false },
    ],
  },
  {
    date: new Date("2023/6/22"),
    contents: [
      { name: "평상 가능(3/6)", expired: false },
      { name: "테이블 마감(6/6)", expired: true },
    ],
  },
  {
    date: new Date("2023/7/5"),
    contents: [
      { name: "평상 가능(0/6)", expired: false },
      { name: "테이블 가능(1/6)", expired: false },
    ],
  },
];
