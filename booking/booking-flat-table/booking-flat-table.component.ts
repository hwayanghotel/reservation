import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { BookingComponent, BookingStep } from "../booking.component";
import { DateAndFlatTable } from "../booking.interface";
import { STANDARD_BOOKING } from "reservation/service/booking/booking.interface";
import { Price } from "reservation/service/booking/booking.interface";

@Component({
    selector: "booking-flat-table",
    templateUrl: "./booking-flat-table.component.html",
    styleUrls: ["./booking-flat-table.component.scss"],
})
export class BookingFlatTableComponent extends BookingComponent {
    @ViewChild("notice") notice: TemplateRef<any>;
    STANDARD_BOOKING = STANDARD_BOOKING;
    Price = Price;

    constructor(private dialog: MatBottomSheet) {
        super();
    }

    price(v: number) {
        return v / 10000;
    }

    override completeNumberOfGuests(v: { person: number; kids: number }) {
        super.completeNumberOfGuests(v);
        this.dialog.open(this.notice);
    }

    completeDateAndTable(v: DateAndFlatTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }

    onNoticeButton() {
        this.dialog.dismiss();
    }
}
