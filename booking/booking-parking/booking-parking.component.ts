import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerInfo } from "../booking.component.interface";
import { BookingService } from "reservation/service/booking/booking.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as Moment from "moment";

@Component({
    selector: "booking-parking",
    templateUrl: "./booking-parking.component.html",
    styleUrls: ["./booking-parking.component.scss"],
})
export class BookingParkingComponent implements OnInit {
    @ViewChild("InputCars") InputCars: TemplateRef<any>;
    cars: string[] = [];
    dialogCars: string[] = [];
    customerInfo: CustomerInfo;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatBottomSheet,
        private snackBar: MatSnackBar,
        private boookingService: BookingService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((customerInfo) => {
            this.customerInfo = {
                ...(customerInfo as CustomerInfo),
                baeksuk: Number(customerInfo["baeksuk"]),
                neungiBaeksuk: Number(customerInfo["neungiBaeksuk"]),
                mushroomStew: Number(customerInfo["mushroomStew"]),
                mushroomStewForTwoPeople: Number(customerInfo["mushroomStewForTwoPeople"]),
                flatTable: Number(customerInfo["flatTable"]),
                dechTable: Number(customerInfo["dechTable"]),
                person: Number(customerInfo["person"]),
                kids: Number(customerInfo["kids"]),
                date: Moment(new Date(customerInfo["date"])),
            };
            this.cars = [...customerInfo["cars"]];
            this.dialogCars = [...customerInfo["cars"]];
        });
    }

    get totalOfCars(): number {
        return this.cars.length;
    }

    set totalOfCars(v: number) {
        if (v > 0) {
            this.cars.push("");
            this.dialogCars.push("");
        } else {
            this.cars.pop();
            this.dialogCars.pop();
        }
    }

    onNext() {
        if (this.totalOfCars > 0) {
            this.dialog
                .open(this.InputCars)
                .afterDismissed()
                .subscribe((needToUpdate: boolean) => {
                    if (needToUpdate) {
                        this.boookingService
                            .update({ ...this.customerInfo, cars: this.cars }, this.customerInfo)
                            .then((user) => {
                                this.router.navigate(["/booking-confirmed"], { queryParams: user });
                            })
                            .catch((e) => {
                                console.error("주차 업데이트 실패", e);
                                this.snackBar.open("주차 등록을 실패했습니다. 다시 시도해주세요.", null, { duration: 2000 });
                            });
                    }
                });
        } else {
            this.onComplete();
        }
    }

    onComplete() {
        const blankCars = this.cars.filter((v) => !v);
        this.cars = [...Array.from(new Set(this.cars.filter((v) => v))), ...blankCars];
        let needToUpdate = this.customerInfo.cars.length !== this.cars.length;
        for (let car of this.customerInfo.cars) {
            if (this.cars.includes(car) === false) {
                needToUpdate = true;
                break;
            }
        }
        this.dialog.dismiss(needToUpdate);
    }

    inputCars(index: number, event: any) {
        this.cars[index] = event.target.value;
    }
}
