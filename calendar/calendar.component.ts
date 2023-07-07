import { Component, Input } from "@angular/core";
import { DBService, ICalenderDB as ICalendarDB } from "reservation/service/DB.service";
import { HolidayService } from "reservation/service/holiday.service";
import * as Moment from "moment";
import { MAX_RESERVATION, ReservationService } from "reservation/service/reservation.service";
import { MatDialog } from "@angular/material/dialog";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";

interface IContent {
    text: string;
    ratio: string;
    expired: boolean;
}

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
    calendarDB: ICalendarDB;

    private _today = new Date();
    constructor(
        protected holidayService: HolidayService,
        protected DBService: DBService,
        protected dialog: MatDialog,
        protected reservationService: ReservationService
    ) {
        this._setCalendar();

        this.DBService.calendarDB$.subscribe((calenderDB: ICalendarDB) => {
            this.calendarDB = calenderDB;
        });
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

    get typeList(): ("평상" | "식사" | "테이블")[] {
        return this.type === "평상" ? ["평상", "테이블"] : ["식사"];
    }

    getContent(date: number, type: "식사" | "평상" | "테이블"): IContent {
        const today = Moment(this.selectedDate).date(date);
        let content: number = 0;
        let index: "식사자리" | "평상" | "테이블" = type === "식사" ? "식사자리" : type;
        try {
            if (type === "식사") {
                content = this.calendarDB[today.format("YYYY-MM")][today.format("YYYY-MM-DD")].foods;
            }
            if (type === "평상") {
                content = this.calendarDB[today.format("YYYY-MM")][today.format("YYYY-MM-DD")].flatBench;
            }
            if (type === "테이블") {
                content = this.calendarDB[today.format("YYYY-MM")][today.format("YYYY-MM-DD")].table;
            }
            content = content ? content : 0;
        } catch {
            content = 0;
        }
        return {
            expired: content >= MAX_RESERVATION[index],
            text: `${index === "식사자리" ? "식사" : index} ${content >= MAX_RESERVATION[index] ? "마감" : ""}`,
            ratio: `(${content}/${MAX_RESERVATION[index]})`,
        };
    }

    isPassed(date: number): boolean {
        if (
            this.selectedDate.getFullYear() === this._today.getFullYear() &&
            this.selectedDate.getMonth() === this._today.getMonth()
        ) {
            const LIMIT_HOURS = 14;
            return (
                this._today.getDate() > date || (this._today.getDate() === date && this._today.getHours() > LIMIT_HOURS)
            );
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

    openDialog(date: number, type: "식사" | "평상" | "테이블") {
        if (type === "테이블") {
            type = "평상";
        }
        this.reservationService.formData$.next({
            ...this.reservationService.formData$.getValue(),
            예약유형: type,
            예약일: Moment(this.selectedDate).date(date).format("YYYY-MM-DD"),
            상태: "대기",
        });
        this.reservationService.bookingStep$.next(1);
        this.dialog.open(ReservationDialogComponent);
    }
}
