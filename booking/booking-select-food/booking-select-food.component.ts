import { AfterViewInit, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Foods } from "../booking.interface";

@Component({
    selector: "booking-select-food",
    templateUrl: "./booking-select-food.component.html",
    styleUrls: ["./booking-select-food.component.scss"],
})
export class BookingSelectFoodComponent implements AfterViewInit {
    @ViewChild("notice") notice: TemplateRef<any>;
    @Input("foods") foods: Foods = { neungiBaeksuk: 0, baeksuk: 0, mushroomStew: 0, mushroomStewForTwoPeople: 0 };
    @Input("type") type: "food" | "flat-table" = "food";
    @Output() completeSelectFoods = new EventEmitter<Foods>();
    @Output() back = new EventEmitter<void>();

    constructor(private dialog: MatBottomSheet) {}

    ngAfterViewInit() {
        if (this.type === "food") {
            this.dialog.open(this.notice);
        }
    }

    get disabled(): boolean {
        return !Boolean(this.foods.neungiBaeksuk || this.foods.baeksuk || this.foods.mushroomStew || this.foods.mushroomStewForTwoPeople);
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
