import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "reservation",
    templateUrl: "./reservation.component.html",
    styleUrls: ["./reservation.component.scss"],
})
export class ReservationComponent implements OnInit {
    type: "평상" | "식사" = "식사";
    constructor(private route: ActivatedRoute, private reservationService: ReservationService) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const step = params["step"];
            console.warn("step", step);
            if (step) {
                setTimeout(() => {
                    this.reservationService.bookingStep$.next(Number(step));
                }, 3000);
            }
        });
    }
}
