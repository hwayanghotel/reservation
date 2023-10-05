import { Component } from "@angular/core";
import * as Moment from "moment";
import { DateAndTable } from "./booking-date/booking-date.component";
import { ExtraInfo } from "./booking-extra-info/booking-extra-info.component";
import { CustomerInfo } from "./booking-confirmed/booking-confirmed.component";
import { Foods } from "./booking-select-food/booking-select-food.component";

export enum BookingStep {
    NumberOfGuests,
    DateAndTime,
    SelectFood,
    ExtraInfo,
    Confirmed,
}

@Component({
    selector: "booking",
    template: "",
    styleUrls: ["./booking.component.scss"],
})
export class BookingComponent {
    numberOfGuests: { person: number; kids: number } = { person: 4, kids: 0 };
    dateAndTable: DateAndTable = { date: Moment().add(1, "d").set("hour", 12).set("minute", 0), flatTable: 0, dechTable: 0 };
    foods: Foods = { 능이백숙: 0, 한방백숙: 0, 버섯찌개: 0, 버섯찌개2: 0 };
    extraInfo: ExtraInfo = { name: "", tel: "", carNumber: [] };
    BookingStep = BookingStep;
    bookingStep: BookingStep = BookingStep.NumberOfGuests;
    customerMemo: string = "";

    get customerInfo(): CustomerInfo {
        return { ...this.numberOfGuests, ...this.dateAndTable, ...this.extraInfo, ...this.foods, customerMemo: this.customerMemo };
    }

    completeNumberOfGuests(v: { person: number; kids: number }) {
        this.numberOfGuests = v;
        this.bookingStep = BookingStep.DateAndTime;
    }

    completeDateAndTable(v: DateAndTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }

    completeExtraInfo(v: ExtraInfo) {
        this.extraInfo = v;
        this.bookingStep = BookingStep.Confirmed;
    }

    completeCustomerInfo(v: CustomerInfo) {
        this.customerMemo = v.customerMemo;
        // this.bookingStep = BookingStep.Complete;
    }

    backStep() {
        this.bookingStep--;
    }
}
