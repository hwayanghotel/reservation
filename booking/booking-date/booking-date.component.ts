import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HolidayService } from "reservation/service/holiday/holiday.service";
import * as Moment from "moment";
import { DateAndFlatTable } from "../booking.component.interface";
import { CalendarService } from "reservation/service/calendar/calendar.service";
import { ICalenderDB } from "reservation/service/calendar/calendar.interface";

export interface ICalendar {
    date: number;
    isHoliday?: boolean;
}

@Component({
    selector: "booking-date",
    template: "",
    styleUrls: ["./booking-date.component.scss"],
})
export class BookingDateComponent {
    @Output() back = new EventEmitter<void>();
    @Output() completeDateAndTable = new EventEmitter<DateAndFlatTable>();
    @Input("dateAndTable") dateAndTable: DateAndFlatTable = { date: Moment().add(1, "d").set("hour", 12).set("minute", 0), flatTable: 0, dechTable: 0 };
    week: string[] = ["일", "월", "화", "수", "목", "금", "토"];
    timeList: string[] = [];
    calendar: ICalendar[][] = [];
    disabledPreviousMonth: boolean = true;
    protected bookingCalendar: ICalenderDB;

    constructor(protected holidayService: HolidayService, protected calendarService: CalendarService) {
        this._setCalendar();
        this._subscribeCalendarDB();
    }

    private _subscribeCalendarDB() {
        this.calendarService.calendarDB$.subscribe((db) => {
            this.bookingCalendar = db;
        });
    }

    get selectedMonth(): string {
        return this.dateAndTable.date.format("YYYY년 MM월");
    }

    isSelected(date: ICalendar): boolean {
        return date.date === this.dateAndTable.date.date();
    }

    isPassed(date: ICalendar): boolean {
        const baseDate = Moment(this.dateAndTable.date).date(date.date);
        return baseDate.format("YYMMDD") < Moment().format("YYMMDD");
    }

    isToday(date?: ICalendar): boolean {
        if (date) {
            return Moment(this.dateAndTable.date).set("date", date.date).format("YYMMDD") === Moment().format("YYMMDD");
        }
        return this.dateAndTable.date.format("YYMMDD") === Moment().format("YYMMDD");
    }

    setSelectedDate(date: ICalendar) {
        this.dateAndTable.date.set("date", date.date);
    }

    moveMonth(direction: -1 | 1) {
        const date = Moment(this.dateAndTable.date).add(direction, "month");
        if (Number(date.format("YYMM")) === Number(Moment().format("YYMM"))) {
            this.dateAndTable.date = Moment();
            this.disabledPreviousMonth = true;
        } else {
            this.dateAndTable.date = date;
            this.disabledPreviousMonth = false;
        }
        this._setCalendar();
    }

    get disabledNextMonth(): boolean {
        return this.dateAndTable.date.year() > Moment().year();
    }

    private async _setCalendar() {
        let calendar: ICalendar[][] = this._initCalendar();
        const holidays = await this.holidayService.getHolidays(this.dateAndTable.date);
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

        const year: number = this.dateAndTable.date.year();
        const month: number = this.dateAndTable.date.month();

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

    onBackButton() {
        this.back.emit();
    }

    onNextButton() {
        this.completeDateAndTable.emit(this.dateAndTable);
    }
}
