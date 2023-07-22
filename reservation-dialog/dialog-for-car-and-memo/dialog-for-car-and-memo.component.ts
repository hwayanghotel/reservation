import { Component } from "@angular/core";
import { ReservationService } from "reservation/service/reservation.service";
import * as Moment from "moment";
import { ManagerService } from "manager/manager.service";
import { DBService, IUserDB } from "reservation/service/DB.service";

@Component({
    selector: "dialog-for-car-and-memo",
    templateUrl: "./dialog-for-car-and-memo.component.html",
    styleUrls: ["./dialog-for-car-and-memo.component.scss", "../reservation-dialog.component.scss"],
})
export class DialogForCarAndMemoComponent {
    model: IUserDB;
    nextTime: boolean;
    permission = this.managerService.permission;

    constructor(private reservationService: ReservationService, private managerService: ManagerService, private DBService: DBService) {
        this.reservationService.formData$.subscribe((data) => {
            this.model = data;
            if (!data["차량번호"] || data["차량번호"].length === 0) {
                this.model["차량번호"] = [];
                this.model["차량방문"] = [];
                this.model["차량번호"].length = 1;
                this.model["차량방문"].length = 1;
            }
            if (!data["차량방문"] || data["차량방문"].length === 0) {
                this.model["차량방문"] = [];
                this.model["차량방문"].length = this.model["차량번호"].length;
            }
            const reservationCost = this.reservationService.getReservationCost(this.model);
            if (reservationCost) {
                this.model["관리자메모"] = `예약금: ${this.reservationService.getReservationCost(this.model)}`;
            }
        });
    }

    get carIndexList(): number[] {
        return Array.from({ length: this.model["차량번호"].length }, (_, index) => index);
    }

    cannotAddForm(): boolean {
        //조건1: 총 주차대수 여유있어야 함
        //조건2: 주문 한도를 넘으면 안 됌
        if (this.permission) {
            return false;
        }
        const availableCars =
            this.model["능이백숙"] + this.model["백숙"] + this.model["버섯찌개"] + this.model["버섯찌개2"] + 2 * (this.model["평상"] + this.model["테이블"]);
        return this.carIndexList.length >= availableCars;
    }

    addForm() {
        this.model["차량번호"].length++;
        this.model["차량방문"].length++;
    }

    deleteForm(index: number) {
        this.model["차량번호"].splice(index, 1);
        this.model["차량방문"].splice(index, 1);
    }

    previousStep() {
        this.reservationService.bookingStep$.next(4);
    }

    onClickNextButton(direct?: boolean) {
        this.model["예약시점"] = Moment().format("YYYY-MM-DD-HH-MM-SS");
        this.model["차량번호"].forEach((value: string, index: number) => {
            this.model["차량방문"][index] = value ? Boolean(this.model["차량방문"][index]) : undefined;
        });
        this.model["차량번호"] = this.model["차량번호"].filter((v) => v);
        this.model["차량방문"] = this.model["차량방문"].filter((v) => v !== undefined);

        if (direct && this.model.id) {
            this.model["상태"] = ["대기", "예약", "수정"].includes(this.model["상태"]) ? "예약" : this.model["상태"];
            this.DBService.set(this.model);
            return;
        }

        if (this.model["상태"] === "예약") {
            this.model["상태"] = "수정";
            this.DBService.edit(this.model);
        } else if (["대기", "방문", "수정"].includes(this.model["상태"]) && this.model.id) {
            this.model["상태"] = this.model["상태"] === "대기" ? "대기" : "수정";
            this.DBService.edit(this.model);
        } else {
            this.DBService.add(this.model);
        }
        this.reservationService.bookingStep$.next(6);
    }
}
