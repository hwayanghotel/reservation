import { Component } from "@angular/core";
import { BookingComponent, BookingStep } from "../booking.component";
import { DateAndTable } from "../booking-date/booking-date.component";
import { Foods } from "../booking-select-food/booking-select-food.component";

@Component({
    selector: "booking-food",
    templateUrl: "./booking-food.component.html",
    styleUrls: ["./booking-food.component.scss"],
})
export class BookingFoodComponent extends BookingComponent {
    foods: Foods = { 능이백숙: 0, 한방백숙: 0, 버섯찌개: 0, 버섯찌개2: 0 };

    override completeDateAndTable(v: DateAndTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.SelectFood;
    }

    completeSelectFoods(v: Foods) {
        console.warn("completeSelectFoods", v);
        this.bookingStep = BookingStep.ExtraInfo;
    }
}
