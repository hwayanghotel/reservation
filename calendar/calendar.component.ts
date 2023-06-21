import { Component, Input } from "@angular/core";
import { HolidayService } from "reservation/service/holiday.service";

interface ICalendar {
    date: number;
    isHoliday?: boolean;
}

@Component({
    selector: "calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
    @Input() type: "평상" | "식사";
    selectedDate: Date = new Date();
    calendar: ICalendar[][] = [];
    week: string[] = ["일", "월", "화", "수", "목", "금", "토"];

    private _today = new Date();
    constructor(private holidayService: HolidayService) {
        this._setCalendar();
    }

    getDate(date: number): Date {
        return new Date(this.currentYear, this.currentMonth - 1, date);
    }

    get currentYear(): number {
        return this.selectedDate.getFullYear();
    }
    get currentMonth(): number {
        return this.selectedDate.getMonth() + 1;
    }

    isPassed(date: number): boolean {
        if (
            this.selectedDate.getFullYear() === this._today.getFullYear() &&
            this.selectedDate.getMonth() === this._today.getMonth()
        ) {
            return this._today.getDate() > date;
        }

        if (this.selectedDate.getFullYear() < this._today.getFullYear()) {
            return true;
        }
        if (this.selectedDate.getFullYear() > this._today.getFullYear()) {
            return false;
        }
        return this.selectedDate.getMonth() < this._today.getMonth();
    }

    moveMonth(direction: -1 | 1) {
        const date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + direction);
        if (date.getFullYear() === this._today.getFullYear() && date.getMonth() === this._today.getMonth()) {
            this.selectedDate = this._today;
        } else {
            this.selectedDate = date;
        }
        this._setCalendar();
    }

    private async _setCalendar() {
        let calendar: ICalendar[][] = this._initCalendar();
        const holidays = await this.holidayService.getHolidays(this.selectedDate);
        for (let i = 0; i < calendar.length; i++) {
            for (let j = 0; j < calendar[i].length; j++) {
                calendar[i][j].isHoliday = holidays.includes(calendar[i][j].date);
                calendar[i][j].date;
            }
        }
        this.calendar = calendar;
    }

    private _initCalendar() {
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
