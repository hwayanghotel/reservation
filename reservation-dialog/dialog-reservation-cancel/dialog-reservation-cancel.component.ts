import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IDBService, DBService } from "reservation/service/DB.service";
import * as Moment from "moment";

@Component({
    selector: "dialog-reservation-cancel",
    templateUrl: "./dialog-reservation-cancel.component.html",
})
export class DialogReservationCancelComponent {
    constructor(
        private DBService: DBService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private data: IDBService,
        private _snackBar: MatSnackBar
    ) {}

    cancelButton() {
        this.DBService.edit({
            ...this.data,
            상태: "취소",
            메모: `취소:${Moment().format("MM-DD")}, ` + this.data["메모"],
        });
        this.dialog.closeAll();
        this._snackBar.open("예약이 취소되었습니다. 다음에 이용해주세요!", null, { duration: 2000 });
    }
}
