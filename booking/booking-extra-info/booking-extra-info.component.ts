import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ExtraInfo } from "../booking.interface";

@Component({
    selector: "booking-extra-info",
    templateUrl: "./booking-extra-info.component.html",
    styleUrls: ["./booking-extra-info.component.scss"],
})
export class BookingExtraInfoComponent {
    @Input("extraInfo") extraInfo: ExtraInfo = { name: "", tel: "", cars: [] };
    @Output() completeExtraInfo = new EventEmitter<ExtraInfo>();
    @Output() back = new EventEmitter<void>();
    private _inputCarNumber: string[] = this.extraInfo.cars;

    constructor() {}

    onBackButton() {
        this.back.emit();
    }

    get cars(): number {
        return this.extraInfo.cars.length;
    }

    inputCarNumber(index: number, event: any) {
        this._inputCarNumber[index] = event.target.value;
    }

    set cars(v: number) {
        if (v > 0) {
            this.extraInfo.cars.push("");
            this._inputCarNumber.push("");
        } else {
            this.extraInfo.cars.pop();
        }
    }

    get disabled(): boolean {
        const telPattern = /^[0-9-]+$/;

        return !this.extraInfo.name || !telPattern.test(this.extraInfo.tel);
    }

    onNextButton() {
        this.extraInfo.cars = this._inputCarNumber;
        this.completeExtraInfo.emit(this.extraInfo);
    }
}
