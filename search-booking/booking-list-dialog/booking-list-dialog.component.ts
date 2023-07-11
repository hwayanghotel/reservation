import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReservationDialogComponent } from "reservation/reservation-dialog/reservation-dialog.component";
import { IUserDB, DBService } from "reservation/service/DB.service";
import { ReservationService } from "reservation/service/reservation.service";

interface Table {
    id: string;
    info: string;
    status: string;
    link: string;
}

@Component({
    selector: "booking-list-dialog",
    templateUrl: "./booking-list-dialog.component.html",
    styleUrls: ["./booking-list-dialog.component.scss", "../../reservation-dialog/reservation-dialog.component.scss"],
})
export class BookingListDialogComponent {
    model: IUserDB = this.reservationService.formData$.getValue();
    list: IUserDB[] = [];

    displayedColumns: string[] = ["info", "status", "link"];
    dataSource: Table[] = [];

    constructor(
        private reservationService: ReservationService,
        private dialog: MatDialog,
        private DBService: DBService
    ) {
        this.setList();
    }

    private async setList() {
        this.list = await this.DBService.search(this.model);
        this.list.sort((a, b) => this._sortList(a, b));
        this.dataSource = [];
        this.list.forEach((model) => {
            let item: Table = {
                id: model.id,
                info: `${model["예약일"].slice(5)} ${model["예약유형"]}`,
                status: model["상태"],
                link: "자세히 보기",
            };
            this.dataSource.push(item);
        });
    }

    goToDetail(element: any) {
        this.dialog.openDialogs[0].afterClosed().subscribe(async () => {
            if (element.id) {
                const model = this.list.filter((v) => v.id === element.id);
                this.reservationService.formData$.next(model[0]);
                this.reservationService.bookingStep$.next(6);
                this.dialog.open(ReservationDialogComponent);
            } else {
                console.log("goToDetail, id가 없음", element);
            }
        });
        this.dialog.getDialogById(this.dialog.openDialogs[0].id).close();
    }

    return() {
        this.reservationService.bookingStep$.next(1);
    }

    private _sortList(a: IUserDB, b: IUserDB) {
        // 1) "날짜"가 빠를수록 정렬
        const dateA = new Date(a["예약일"]);
        const dateB = new Date(b["예약일"]);
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        // 2) "상태"가 "대기" > "수정" > "예약" > "방문" > "취소" 순서로 정렬
        const statusOrder = {
            대기: 0,
            수정: 1,
            예약: 2,
            방문: 3,
            취소: 4,
        };
        const statusA = statusOrder[a["상태"]];
        const statusB = statusOrder[b["상태"]];
        if (statusA < statusB) {
            return -1;
        }
        if (statusA > statusB) {
            return 1;
        }

        return 0; // 동일한 경우 유지
    }
}
