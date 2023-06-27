import { Component } from "@angular/core";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "search-booking",
    templateUrl: "./search-booking.component.html",
})
export class SearchBookingComponent {
    step: number = 1;
    constructor(private reservationService: ReservationService) {
        this.reservationService.bookingStep$.next(1);
        this.reservationService.bookingStep$.subscribe((v) => {
            this.step = v;
        });
    }
}
