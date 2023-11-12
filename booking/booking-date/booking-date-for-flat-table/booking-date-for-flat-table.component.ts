import { AfterViewInit, Component, EventEmitter, Output, TemplateRef, ViewChild } from "@angular/core";
import { BookingDateComponent, ICalendar } from "../booking-date.component";
import { MAX_BOOKING, Price, STANDARD_BOOKING } from "reservation/service/booking/booking.interface";
import { HolidayService } from "reservation/service/holiday/holiday.service";
import { CalendarService } from "reservation/service/calendar/calendar.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { DateAndFlatTable } from "reservation/booking/booking.interface";

@Component({
    selector: "booking-date-for-flat-table",
    templateUrl: "./booking-date-for-flat-table.component.html",
    styleUrls: ["./booking-date-for-flat-table.component.scss"],
})
export class BookingDateForFlatTableComponent extends BookingDateComponent implements AfterViewInit {
    @ViewChild("notice") notice: TemplateRef<any>;
    @ViewChild("addFoodBooking") addFoodBooking: TemplateRef<any>;
    @Output() noNeedFood = new EventEmitter<DateAndFlatTable>();
    STANDARD_BOOKING = STANDARD_BOOKING;
    Price = Price;

    constructor(holidayService: HolidayService, calendarService: CalendarService, private dialog: MatBottomSheet) {
        super(holidayService, calendarService);
    }

    ngAfterViewInit() {
        this.dialog.open(this.notice);
    }

    override setSelectedDate(date: ICalendar) {
        super.setSelectedDate(date);
        this._adjustselectedTableNumber();
    }

    private _adjustselectedTableNumber() {
        if (this.isMaxLimitExceeded("flatTable")) {
            this.dateAndTable.flatTable = 0;
            while (!this.isMaxLimitExceeded("flatTable")) {
                this.dateAndTable.flatTable++;
            }
        }
        if (this.isMaxLimitExceeded("dechTable")) {
            this.dateAndTable.dechTable = 0;
            while (!this.isMaxLimitExceeded("dechTable")) {
                this.dateAndTable.dechTable++;
            }
        }
    }

    get flatTable(): number {
        return this.dateAndTable.flatTable;
    }

    get dechTable(): number {
        return this.dateAndTable.dechTable;
    }

    get disabled(): boolean {
        return this.isToday() || this.flatTable + this.dechTable === 0;
    }

    setFlatTable(v: number) {
        this.dateAndTable.flatTable += v;
    }

    setDechTable(v: number) {
        this.dateAndTable.dechTable += v;
    }

    isBookingClosed(d: number): boolean {
        try {
            const month = this.dateAndTable.date.format("YYMM");
            const date = d ? `${month}${d < 10 ? `0${d}` : d.toString()}` : this.dateAndTable.date.format("YYMMDD");

            const isFlatTableBookingClosed = this.bookingCalendar[month][date].flatTable >= MAX_BOOKING.flatTable;
            const isDechTableBookingClosed = this.bookingCalendar[month][date].dechTable >= MAX_BOOKING.dechTable;
            return isFlatTableBookingClosed && isDechTableBookingClosed;
        } catch {
            return false;
        }
    }

    isMaxLimitExceeded(type: "flatTable" | "dechTable"): boolean {
        try {
            const month = this.dateAndTable.date.format("YYMM");
            const date = this.dateAndTable.date.format("YYMMDD");
            return type === "flatTable"
                ? this.bookingCalendar[month][date].flatTable + this.flatTable >= MAX_BOOKING.flatTable
                : this.bookingCalendar[month][date].dechTable + this.dechTable >= MAX_BOOKING.dechTable;
        } catch {
            return type === "flatTable" ? this.flatTable >= MAX_BOOKING.flatTable : this.dechTable >= MAX_BOOKING.dechTable;
        }
    }

    override onNextButton() {
        this.dialog.dismiss();
        super.onNextButton();
    }

    price(v: number) {
        return v / 10000;
    }

    openAddFoodBookingDialog() {
        this.dialog.open(this.addFoodBooking);
    }

    noNeedFoodBooking() {
        this.dialog.dismiss();
        this.noNeedFood.emit(this.dateAndTable);
    }

    onNoticeButton() {
        this.dialog.dismiss();
    }
}
