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
    override completeDateAndTable(v: DateAndTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.SelectFood;
    }

    completeSelectFoods(v: Foods) {
        this.foods = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }
}
