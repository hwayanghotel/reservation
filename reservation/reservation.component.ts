import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";
import { SearchBookingComponent } from "reservation/search-booking/search-booking.component";
import { ReservationService } from "reservation/service/reservation.service";
import { DBService } from "reservation/service/DB.service";
import { UploaderService } from "reservation/service/uploader.service";

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
        private dialog: MatDialog,
        private DBService: DBService,
        private Uploader: UploaderService
    ) {
        this.Uploader.uploadTest(false);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const id = params["id"];
            this.type = params["type"];
            if (id) {
                this._openCustomerInfoDialog(id, this.type);
            }
        });
    }

    private async _openCustomerInfoDialog(id: string, type: string) {
        console.warn("고객 직접 검색", id, type);
        if (id) {
            const forms = await this.DBService.search({ id: id });
            this.reseravationService.formData$.next(forms[0]);
            this.reseravationService.bookingStep$.next(6);
            this.dialog.open(ReservationDialogComponent);
        } else if (type === "room") {
            this.reseravationService.formData$.next({ 예약유형: "객실", 상태: "수정" });
            this.reseravationService.bookingStep$.next(1);
            this.dialog.open(ReservationDialogComponent);
        } else if (type === "search") {
            this.dialog.open(SearchBookingComponent);
        }
    }
}
