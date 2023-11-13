import { Component } from "@angular/core";
import { BookingDateComponent, ICalendar } from "../booking-date.component";
import { MAX_BOOKING } from "reservation/service/booking/booking.service.interface";
import { HolidayService } from "reservation/service/holiday/holiday.service";
import { CalendarService } from "reservation/service/calendar/calendar.service";
import * as Moment from "moment";

@Component({
    selector: "booking-date-for-food",
    templateUrl: "./booking-date-for-food.component.html",
    styleUrls: ["./booking-date-for-food.component.scss"],
})
export class BookingDateForFoodComponent extends BookingDateComponent {
    get disabled(): boolean {
        return this.isToday();
    }

    constructor(holidayService: HolidayService, calendarService: CalendarService) {
        super(holidayService, calendarService);
        this._setBookingTimeList();
    }

    override setSelectedDate(date: ICalendar) {
        super.setSelectedDate(date);
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

    isSelectedTime(time: string): boolean {
        return this.dateAndTable.date.format("HH:mm") === time;
    }

    isTimeNotSupported(time: string): boolean {
        try {
            const timeIndex = (Number(time.split(":")[0]) - 10) * 2 + Number(time.split(":")[1]) / 30;
            const month = this.dateAndTable.date.format("YYMM");
            const date = this.dateAndTable.date.format("YYMMDD");

            let result: boolean = false;
            for (let i = timeIndex - 2; i <= timeIndex + 2; i++) {
                if (i < 0) continue;
                if (this.bookingCalendar[month][date].foods[i] >= MAX_BOOKING.foodTable) {
                    result = true;
                }
            }
            return result;
        } catch {
            return false;
        }
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
}
