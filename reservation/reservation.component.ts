import { Component } from "@angular/core";

@Component({
    selector: "reservation",
    templateUrl: "./reservation.component.html",
    styleUrls: ["./reservation.component.scss"],
})
export class ReservationComponent {
    type: "평상" | "식사" = "식사";
    constructor() {}
}
