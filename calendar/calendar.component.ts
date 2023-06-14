import { Component } from "@angular/core";

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
  date = new Date();
  currentYear: number = this.date.getFullYear();
  currentMonth: number = this.date.getMonth() + 1;
  calendar: number[][] = this.getCalendar(this.currentYear, this.currentMonth);

  constructor() {}

  isPast(date: number): boolean {
    return date < this.date.getDate();
  }

  getCalendar(year: number, month: number): number[][] {
    const calendar: number[][] = [];

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

    let currentDate = 1;
    for (let i = 0; i < 6; i++) {
      const week: number[] = [];

      if (i === 0) {
        for (let j = 0; j < firstDayOfWeek; j++) {
          week.push(0);
        }
      }

      for (let j = week.length; j < 7; j++) {
        if (currentDate <= daysInMonth) {
          week.push(currentDate);
          currentDate++;
        } else {
          week.push(0);
        }
      }

      calendar.push(week);

      if (currentDate > daysInMonth) {
        break;
      }
    }

    return calendar;
  }

  previousMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }

    this.calendar = this.getCalendar(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }

    this.calendar = this.getCalendar(this.currentYear, this.currentMonth);
  }
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
