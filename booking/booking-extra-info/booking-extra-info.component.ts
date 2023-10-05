import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface ExtraInfo {
    name: string;
    tel: string;
    carNumber: string[];
}

@Component({
    selector: "booking-extra-info",
    templateUrl: "./booking-extra-info.component.html",
    styleUrls: ["./booking-extra-info.component.scss"],
})
export class BookingExtraInfoComponent {
    @Input("extraInfo") extraInfo: ExtraInfo = { name: "", tel: "", carNumber: [] };
    @Output() completeExtraInfo = new EventEmitter<ExtraInfo>();
    @Output() back = new EventEmitter<void>();
    private _inputCarNumber: string[] = this.extraInfo.carNumber;

    constructor() {}

    onBackButton() {
        this.back.emit();
    }

    get carNumber(): number {
        return this.extraInfo.carNumber.length;
    }

    inputCarNumber(index: number, event: any) {
        this._inputCarNumber[index] = event.target.value;
    }

    set carNumber(v: number) {
        if (v > 0) {
            this.extraInfo.carNumber.push("");
            this._inputCarNumber.push("");
        } else {
            this.extraInfo.carNumber.pop();
        }
    }

    onNextButton() {
        this.extraInfo.carNumber = this._inputCarNumber;
        this.completeExtraInfo.emit(this.extraInfo);
    }
}
