import { Component } from "@angular/core";
import { BookingDateComponent, ICalendar } from "../booking-date.component";
import { MAX_BOOKING } from "reservation/service/booking/booking.interface";

@Component({
    selector: "booking-date-for-flat-table",
    templateUrl: "./booking-date-for-flat-table.component.html",
    styleUrls: ["./booking-date-for-flat-table.component.scss"],
})
export class BookingDateForFlatTableComponent extends BookingDateComponent {
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
}
