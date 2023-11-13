import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NumberOfGuests } from "../booking.component.interface";

@Component({
    selector: "booking-number-guest",
    templateUrl: "./booking-number-guest.component.html",
    styleUrls: ["./booking-number-guest.component.scss"],
})
export class BookingNumberGuestComponent {
    @Input("numberOfGuests") guest: NumberOfGuests = { person: 4, kids: 0 };
    @Output() completeNumberOfGuests = new EventEmitter<NumberOfGuests>();
    constructor() {}

    onBackButton() {
        window.history.back();
    }

    onNextButton() {
        this.completeNumberOfGuests.emit(this.guest);
    }
}
