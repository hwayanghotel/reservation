import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { BookingComponent } from "../booking.component";

@Component({
    selector: "booking-flat-table",
    templateUrl: "./booking-flat-table.component.html",
    styleUrls: ["./booking-flat-table.component.scss"],
})
export class BookingFlatTableComponent extends BookingComponent {
    @ViewChild("notice") notice: TemplateRef<any>;

    constructor(private dialog: MatBottomSheet) {
        super();
    }

    override completeNumberOfGuests(v: { person: number; kids: number }) {
        super.completeNumberOfGuests(v);
        this.dialog.open(this.notice);
    }

    onNoticeButton() {
        this.dialog.dismiss();
    }
}
