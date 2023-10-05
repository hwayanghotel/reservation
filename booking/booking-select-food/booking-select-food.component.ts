import { AfterViewInit, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

export interface Foods {
    능이백숙: number;
    한방백숙: number;
    버섯찌개: number;
    버섯찌개2: number;
}

@Component({
    selector: "booking-select-food",
    templateUrl: "./booking-select-food.component.html",
    styleUrls: ["./booking-select-food.component.scss"],
})
export class BookingSelectFoodComponent implements AfterViewInit {
    @ViewChild("notice") notice: TemplateRef<any>;
    @Input("foods") foods: Foods = { 능이백숙: 0, 한방백숙: 0, 버섯찌개: 0, 버섯찌개2: 0 };
    @Output() completeSelectFoods = new EventEmitter<Foods>();
    @Output() back = new EventEmitter<void>();

    constructor(private dialog: MatBottomSheet) {}

    ngAfterViewInit() {
        this.dialog.open(this.notice);
    }

    onBackButton() {
        this.back.emit();
    }

    onNextButton() {
        this.completeSelectFoods.emit(this.foods);
    }

    onNoticeButton() {
        this.dialog.dismiss();
    }
}
