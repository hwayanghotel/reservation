import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";
import { SearchBookingComponent } from "reservation/search-booking/search-booking.component";
import { ReservationService } from "reservation/service/reservation.service";

@Component({
    selector: "reservation",
    templateUrl: "./reservation.component.html",
    styleUrls: ["./reservation.component.scss"],
})
export class ReservationComponent implements OnInit {
    type: "평상" | "식사" = "식사";

    constructor(
        private route: ActivatedRoute,
        private reseravationService: ReservationService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const id = params["id"];
            const type = params["type"];
            if (id || type) {
                this._openCustomerInfoDialog(id, type);
            }
        });
    }

    private async _openCustomerInfoDialog(id: string, type: string) {
        console.warn("고객 직접 검색", id, type);
        if (id) {
            const forms = await this.reseravationService.search(id);
            this.reseravationService.setReservationForm(forms[0]);
            this.reseravationService.bookingStep$.next(6);
            this.dialog.open(ReservationDialogComponent);
        } else if (type === "room") {
            this.reseravationService.setReservationForm({ 예약유형: "객실", 상태: "수정" }, true);
            this.reseravationService.bookingStep$.next(1);
            this.dialog.open(ReservationDialogComponent);
        } else if (type === "search") {
            this.dialog.open(SearchBookingComponent);
        }
    }
}
