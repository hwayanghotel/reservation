import { Component } from "@angular/core";
import { DBService } from "reservation/service/DB.service";
import { HolidayService } from "reservation/service/holiday.service";

interface ICalendar {
  date: number;
  isHoliday?: boolean;
  content?: { text: string; expired: boolean }[];
}

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
  selectedDate = new Date();
  private today = new Date();
  calendar: ICalendar[][] = [];

  week: string[] = ["일", "월", "화", "수", "목", "금", "토"];

  constructor(
    private holidayService: HolidayService,
    private DBService: DBService
  ) {
    this.setCalendar();
  }

  get currentYear(): number {
    return this.selectedDate.getFullYear();
  }
  get currentMonth(): number {
    return this.selectedDate.getMonth() + 1;
  }

  moveMonth(direction: -1 | 1) {
    const date = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + direction
    );
    if (
      date.getFullYear() === this.today.getFullYear() &&
      date.getMonth() === this.today.getMonth()
    ) {
      this.selectedDate = this.today;
    } else {
      this.selectedDate = date;
    }
    this.setCalendar();
  }

  private async setCalendar() {
    let calendar: ICalendar[][] = this.initCalendar();
    const holidays = await this.holidayService.getHolidays(this.selectedDate);
    const monthlyData = await this.DBService.getMonthlyData(this.selectedDate);
    for (let i = 0; i < calendar.length; i++) {
      for (let j = 0; j < calendar[i].length; j++) {
        calendar[i][j].isHoliday = holidays.includes(calendar[i][j].date);
        if (
          monthlyData.filter((v) => v.date.getDate() === calendar[i][j].date)
            .length > 0
        ) {
          calendar[i][j].content = monthlyData.filter(
            (v) => v.date.getDate() === calendar[i][j].date
          )[0].content;
        }
        calendar[i][j].date;
      }
    }
    this.calendar = calendar;
  }

  disabled(date: number): boolean {
    if (
      this.selectedDate.getFullYear() === this.today.getFullYear() &&
      this.selectedDate.getMonth() === this.today.getMonth()
    ) {
      return this.today.getDate() > date;
    }
    return (
      this.selectedDate.getFullYear() < this.today.getFullYear() ||
      this.selectedDate.getMonth() < this.today.getMonth()
    );
  }

  private initCalendar() {
    const calendar: ICalendar[][] = [];

    const year: number = this.selectedDate.getFullYear();
    const month: number = this.selectedDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    let currentDate = 1;
    for (let date = 0; date < 6; date++) {
      const week: ICalendar[] = [];

      if (date === 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          week.push({ date: 0 });
        }
      }

      for (let j = week.length; j < 7; j++) {
        if (currentDate <= daysInMonth) {
          week.push({ date: currentDate });
          currentDate++;
        } else {
          week.push({ date: 0 });
        }
      }

      calendar.push(week);

      if (currentDate > daysInMonth) {
        break;
      }
    }

    return calendar;
  }
}
