import { Component, OnInit } from "@angular/core";
import { IReservationForm, ReservationService } from "reservation/service/reservation.service";

export interface IReservationFormPreData {
    type: "food" | "flat-bench";
    date: string;
    time?: "12:00" | "15:00";
}

@Component({
    selector: "reservation-form",
    templateUrl: "./reservation-form.component.html",
    styleUrls: ["./reservation-form.component.scss"],
})
export class ReservationFormComponent implements OnInit {
    isOpen: boolean;
    model: IReservationForm;
    constructor(private reservationService: ReservationService) {
        this.reservationService.isOpen$.subscribe((isOpen) => {
            this.isOpen = isOpen;
        });
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
        });
    }

    get type(): "식사" | "평상" {
        return this.model.type === "food" ? "식사" : "평상";
    }

    ngOnInit() {}

    closeDialog() {
        this.reservationService.isOpen$.next(false);
    }

    onSubmit() {}
}
