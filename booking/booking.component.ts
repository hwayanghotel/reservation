import { Component } from "@angular/core";
import * as Moment from "moment";
import { CustomerInfo, DateAndFlatTable, ExtraInfo, Foods } from "./booking.interface";

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
    dateAndTable: DateAndFlatTable = { date: Moment().add(1, "d").set("hour", 10).set("minute", 0), flatTable: 0, dechTable: 0 };
    foods: Foods = { neungiBaeksuk: 0, baeksuk: 0, mushroomStew: 0, mushroomStewForTwoPeople: 0 };
    extraInfo: ExtraInfo = { name: "", tel: "", carNumbers: [] };
    BookingStep = BookingStep;
    bookingStep: BookingStep = BookingStep.NumberOfGuests;
    id: string = Moment().format("YYMMDDHHmmss");

    get customerInfo(): CustomerInfo {
        return {
            id: this.id,
            customerMemo: "",
            status: "ready",
            ...this.numberOfGuests,
            ...this.dateAndTable,
            ...this.extraInfo,
            ...this.foods,
        };
    }

    completeNumberOfGuests(v: { person: number; kids: number }) {
        this.numberOfGuests = v;
        this.bookingStep = BookingStep.DateAndTime;
    }

    completeDateAndTable(v: DateAndFlatTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.SelectFood;
    }

    completeSelectFoods(v: Foods) {
        this.foods = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }

    completeExtraInfo(v: ExtraInfo) {
        this.extraInfo = v;
        this.bookingStep = BookingStep.Confirmed;
    }

    backStep() {
        if (this.bookingStep === BookingStep.ExtraInfo) {
            this.bookingStep -= Number(this.dateAndTable.dechTable || this.dateAndTable.flatTable);
        }
        this.bookingStep--;
    }
}
