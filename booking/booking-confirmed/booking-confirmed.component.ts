import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { Price, STANDARD_BOOKING } from "reservation/service/booking/booking.service.interface";
import { BookingService } from "reservation/service/booking/booking.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { CustomerInfo } from "../booking.component.interface";
import { Router } from "@angular/router";
import { MediatorService } from "reservation/service/mediator/mediator.service";

@Component({
    selector: "booking-confirmed",
    templateUrl: "./booking-confirmed.component.html",
    styleUrls: ["./booking-confirmed.component.scss"],
})
export class BookingConfirmedComponent {
    @ViewChild("CancelPopup") cancelPopup: TemplateRef<any>;
    @Output() back = new EventEmitter<void>();
    @Input("customerInfo") customerInfo: CustomerInfo;
    memo: string;
    status: "ready" | "paymentReady" | "confirming" | "bookingComplete" | "cancel" = "ready";

    constructor(
        private bookingService: BookingService,
        private snackBar: MatSnackBar,
        private dialog: MatBottomSheet,
        private router: Router,
        private mediatorService: MediatorService
    ) {
        this.customerInfo = this.mediatorService.customerInfo;
        this.status = this.customerInfo.status;
        this.memo = this.customerInfo.customerMemo;
    }

    get id(): string {
        return this.customerInfo.id;
    }

    get name(): string {
        return this.customerInfo.name;
    }

    get tel(): string {
        return this.customerInfo.tel;
    }

    get guests(): string {
        const person = this.customerInfo.person;
        const kids = this.customerInfo.kids;
        return kids > 0 ? `${person + kids}명 (소인 ${kids}명)` : `${person}명`;
    }

    get date(): string {
        return this.customerInfo.date.format("YYYY. MM. DD(dd)");
    }

    get bookingFlatTable(): string {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        if (flat && dech) {
            return `평상 ${flat}대, 데크 ${dech}대`;
        }
        if (flat) {
            return `평상 ${flat}대`;
        }
        if (dech) {
            return `데크 ${dech}대`;
        }
        return "";
    }

    get bookingFoods(): string {
        const 능이 = this.customerInfo.neungiBaeksuk;
        const 한방 = this.customerInfo.baeksuk;
        const 버섯 = this.customerInfo.mushroomStew;
        const 버섯2 = this.customerInfo.mushroomStewForTwoPeople;
        let foods: string = "";
        if (능이) {
            foods = `능이백숙 ${능이}상`;
        }
        if (한방) {
            foods += `${foods ? "<br>" : ""}한방백숙 ${한방}상`;
        }
        if (버섯) {
            foods += `${foods ? "<br>" : ""}버섯찌개 ${버섯}상`;
        }
        if (버섯2) {
            foods += `${foods ? "<br>" : ""}버섯찌개(2인) ${버섯2}상`;
        }
        return foods;
    }

    get totalOfCars(): number {
        return this.customerInfo.cars.length;
    }

    get carList(): string {
        let description = "";
        this.customerInfo.cars
            .filter((v) => v.length)
            .forEach((car) => {
                if (description !== "") {
                    description += ", ";
                }
                description += car;
            });

        const noInputs = this.customerInfo.cars.filter((v) => !v.length).length;
        if (noInputs) {
            if (description !== "") {
                description += ", ";
            }
            description += `미입력 ${noInputs}대`;
        }

        return description;
    }

    get cost(): number {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        const guests = this.customerInfo.person + this.customerInfo.kids;
        const additionalGuests = guests - STANDARD_BOOKING.flatTableGuests.std * (flat + dech);
        return flat * Price["평상"] + dech * Price["데크"] + (additionalGuests > 0 ? additionalGuests * Price["평상추가인원"] : 0);
    }

    onAddButton() {
        this.bookingService
            .add({
                ...this.customerInfo,
                id: this.id,
                status: this.customerInfo.flatTable || this.customerInfo.dechTable ? "paymentReady" : "confirming",
                customerMemo: this.memo || null,
            })
            .then((user) => {
                this.customerInfo = user;
                this.status = user.status;
            })
            .catch((e) => {
                console.error("신규 예약 등록 실패", e);
                this.snackBar.open("예약을 실패했습니다. 다시 시도해주세요.", null, { duration: 2000 });
            });
    }

    onOkayButton() {
        window.history.back();
    }

    onCancelButton() {
        this.dialog.open(this.cancelPopup);
    }

    closePopup() {
        this.dialog.dismiss();
    }

    onBookingCancelButton() {
        this.closePopup();

        this.bookingService
            .cancel(this.customerInfo)
            .then((user) => {
                this.customerInfo = user;
            })
            .catch((e) => this.snackBar.open("예약이 취소되지 않았습니다. 다시 시도해주세요.", null, { duration: 2000 }));
    }

    moveBookingParkingPage() {
        this.mediatorService.customerInfo = this.customerInfo;
        this.router.navigate(["/booking-parking"]);
    }
}
