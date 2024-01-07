import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UserInfo } from "../booking.component.interface";

@Component({
    selector: "booking-user-info",
    templateUrl: "./booking-user-info.component.html",
    styleUrls: ["./booking-user-info.component.scss"],
})
export class BookingUserInfoComponent {
    @Input("userInfo") userInfo: UserInfo = { name: "", tel: "" };
    @Output() completeUserInfo = new EventEmitter<UserInfo>();
    @Output() back = new EventEmitter<void>();

    get tel(): string {
        return this.userInfo.tel;
    }

    set tel(v: string) {
        let input: string = v;
        if (this.userInfo.tel.length < input.length && input.length === 8) {
            input += "-";
        }
        if (!input.includes("010-")) {
            input = "010-";
        }
        this.userInfo.tel = input;
    }

    onBackButton() {
        this.back.emit();
    }

    get disabled(): boolean {
        const telPattern = /^[0-9-]+$/;
        return !this.userInfo.name || !telPattern.test(this.userInfo.tel) || this.userInfo.tel.length < 12;
    }

    onNextButton() {
        this.completeUserInfo.emit(this.userInfo);
    }
}
