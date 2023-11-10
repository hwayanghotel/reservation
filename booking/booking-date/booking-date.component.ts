import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HolidayService } from "reservation/service/holiday.service";
import * as Moment from "moment";
import { DateAndFlatTable } from "../booking.interface";

interface ICalendar {
    date: number;
    isHoliday?: boolean;
}

@Component({
    selector: "booking-date",
    templateUrl: "./booking-date.component.html",
    styleUrls: ["./booking-date.component.scss"],
})
export class BookingDateComponent {
    @Output() back = new EventEmitter<void>();
    @Output() completeDateAndTable = new EventEmitter<DateAndFlatTable>();
    @Input("type") type: "food" | "flat-table" = "food";
    @Input("dateAndTable") dateAndTable: DateAndFlatTable = { date: Moment().add(1, "d").set("hour", 12).set("minute", 0), flatTable: 0, dechTable: 0 };
    week: string[] = ["일", "월", "화", "수", "목", "금", "토"];
    timeList: string[] = [];
    calendar: ICalendar[][] = [];
    disabledPreviousMonth: boolean = true;

    constructor(private holidayService: HolidayService) {
        this._setCalendar();
        this._setBookingTimeList();
    }

    get selectedMonth(): string {
        return this.dateAndTable.date.format("YYYY년 MM월");
    }

    get flatTable(): number {
        return this.dateAndTable.flatTable;
    }

    get dechTable(): number {
        return this.dateAndTable.dechTable;
    }

    get disabled(): boolean {
        return this.isToday() || (this.type === "flat-table" ? this.flatTable + this.dechTable === 0 : false);
    }

    isSelected(date: ICalendar): boolean {
        return date.date === this.dateAndTable.date.date();
    }

    isSelectedTime(time: string): boolean {
        return this.dateAndTable.date.format("HH:mm") === time;
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

    isTimeNotSupported(time: string): boolean {
        //총 좌석 로직 계산하고,
        //이전 2시간(?) 까지 포함 계산해서
        //해당 시간에 예약이 가능한 지 계산해야 함.
        return false;
    }

    setSelectedDate(date: ICalendar) {
        this.dateAndTable.date.set("date", date.date);
        this._setBookingTimeList();
    }

    private _setBookingTimeList() {
        let timeList = [];
        let time = Moment().hour(10).minutes(0);

        if (this.isToday() && Moment().hour() >= 10) {
            time = Moment().minutes() > 30 ? Moment().add(1, "h").minutes(0) : Moment().minutes(30);
        }
        while (time.hour() < 17) {
            timeList.push(time.format("HH:mm"));
            time.add(30, "m");
        }
        this.timeList = timeList;
    }

    setSelectedTime(time: string) {
        const [hour, minute] = time.split(":").map((v) => Number(v));
        this.dateAndTable.date.hour(hour);
        this.dateAndTable.date.minute(minute);
    }

    setFlatTable(v: number) {
        this.dateAndTable.flatTable += v;
    }

    setDechTable(v: number) {
        this.dateAndTable.dechTable += v;
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
