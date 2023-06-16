import { Component } from "@angular/core";

@Component({
    selector: "reservation",
    templateUrl: "./reservation.component.html",
    styleUrls: ["./reservation.component.scss"],
})
export class ReservationComponent {
    type: "flat-bench" | "food" = "food";
    constructor() {}
}
