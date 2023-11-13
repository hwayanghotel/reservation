import { Component } from "@angular/core";
import { BookingComponent, BookingStep } from "../booking.component";
import { DateAndFlatTable } from "../booking.component.interface";

@Component({
    selector: "booking-flat-table",
    templateUrl: "./booking-flat-table.component.html",
    styleUrls: ["./booking-flat-table.component.scss"],
})
export class BookingFlatTableComponent extends BookingComponent {
    noNeedFood(v: DateAndFlatTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }
}
