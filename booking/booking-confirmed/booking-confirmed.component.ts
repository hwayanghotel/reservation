import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DateAndTable } from "../booking-date/booking-date.component";
import { ExtraInfo } from "../booking-extra-info/booking-extra-info.component";
import { NumberOfGuests } from "../booking-number-guest/booking-number-guest.component";
import { Price } from "src/assets/price";
import { StandardNumberOfPeople } from "reservation/service/reservation.service";
import { Foods } from "../booking-select-food/booking-select-food.component";

export interface CustomerInfo extends DateAndTable, ExtraInfo, NumberOfGuests, Foods {
    customerMemo: string;
}

@Component({
    selector: "booking-confirmed",
    templateUrl: "./booking-confirmed.component.html",
    styleUrls: ["./booking-confirmed.component.scss"],
})
export class BookingConfirmedComponent {
    @Output() back = new EventEmitter<void>();
    @Output() completeCustomerInfo = new EventEmitter<CustomerInfo>();
    @Input("customerInfo") customerInfo: CustomerInfo;
    memo: string;
    status: "ready" | "ing" | "done" = "ready";

    get name(): string {
        return this.customerInfo.name;
    }

    get tel(): string {
        return this.customerInfo.tel;
    }

    get guests(): string {
        const person = this.customerInfo.person;
        const kids = this.customerInfo.kids;
        return kids > 0 ? `${person + kids}명 (소인 ${kids}명)` : `${person}명`;
    }

    get date(): string {
        return this.customerInfo.date.format("YYYY. MM. DD(dd)");
    }

    get bookingFlatTable(): string {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        if (flat && dech) {
            return `평상 ${flat}대, 데크 ${dech}대`;
        }
        return flat ? `평상 ${flat}대` : `데크 ${dech}대`;
    }

    get bookingFoods(): string {
        const 능이 = 1;
        const 한방 = 2;
        const 버섯 = 0;
        const 버섯2 = 0;
        let foods: string = "";
        if (능이) {
            foods = `능이백숙 ${능이}상`;
        }
        if (한방) {
            foods += `${foods ? "<br>" : ""}한방백숙 ${한방}상`;
        }
        if (버섯) {
            foods += `${foods ? "<br>" : ""}버섯찌개 ${버섯}상`;
        }
        if (버섯2) {
            foods += `${foods ? "<br>" : ""}버섯찌개(2인) ${버섯2}상`;
        }
        return foods;
    }

    get totalOfCars(): number {
        return this.customerInfo.carNumber.length;
    }

    get carList(): string {
        let description = "";
        this.customerInfo.carNumber
            .filter((v) => v.length)
            .forEach((car) => {
                if (description !== "") {
                    description += ", ";
                }
                description += car;
            });
        return description;
    }

    get cost(): number {
        const flat = this.customerInfo.flatTable;
        const dech = this.customerInfo.dechTable;
        const guests = this.customerInfo.person + this.customerInfo.kids;
        const additionalGuests = guests - StandardNumberOfPeople["평상"]["적정인원"] * (flat + dech);
        return flat * Price["평상"] + dech * Price["데크"] + (additionalGuests > 0 ? additionalGuests * Price["평상추가인원"] : 0);
    }

    onBackButton() {
        this.back.emit();
    }

    onBookingButton() {
        console.warn("onBookingButton");
        if (this.status === "ready") this.status = "ing";
        else if (this.status === "ing") this.status = "done";
        else if (this.status === "done") this.status = "ready";
        // this.completeCustomerInfo.emit({
        //     ...this.customerInfo,
        //     customerMemo: this.memo,
        // });
    }
}
