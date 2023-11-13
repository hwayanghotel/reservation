import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UserInfo } from "../booking.component.interface";

@Component({
    selector: "booking-user-info",
    templateUrl: "./booking-user-info.component.html",
    styleUrls: ["./booking-user-info.component.scss"],
})
export class BookingUserInfoComponent {
    @Input("userInfo") userInfo: UserInfo = { name: "", tel: "", cars: [] };
    @Output() completeUserInfo = new EventEmitter<UserInfo>();
    @Output() back = new EventEmitter<void>();
    private _inputCarNumber: string[] = this.userInfo.cars;

    constructor() {}

    onBackButton() {
        this.back.emit();
    }

    get cars(): number {
        return this.userInfo.cars.length;
    }

    inputCarNumber(index: number, event: any) {
        this._inputCarNumber[index] = event.target.value;
    }

    set cars(v: number) {
        if (v > 0) {
            this.userInfo.cars.push("");
            this._inputCarNumber.push("");
        } else {
            this.userInfo.cars.pop();
        }
    }

    get disabled(): boolean {
        const telPattern = /^[0-9-]+$/;

        return !this.userInfo.name || !telPattern.test(this.userInfo.tel);
    }

    onNextButton() {
        this.userInfo.cars = this._inputCarNumber;
        this.completeUserInfo.emit(this.userInfo);
    }
}
