import { Component } from "@angular/core";
import { ManagerService } from "manager/manager.service";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "reservation-dialog",
    templateUrl: "./reservation-dialog.component.html",
    styleUrls: ["./reservation-dialog.component.scss"],
})
export class ReservationDialogComponent {
    step: number;
    constructor(private reservationService: ReservationService, private managerService: ManagerService) {
        this.reservationService.bookingStep$.subscribe((step) => {
            this.step = step;
        });
    }
    get permission(): boolean {
        return this.managerService.permission;
    }
}
