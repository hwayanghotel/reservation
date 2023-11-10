import { Component } from "@angular/core";
import { BookingComponent, BookingStep } from "../booking.component";
import { DateAndFlatTable, Foods } from "../booking.interface";

@Component({
    selector: "booking-food",
    templateUrl: "./booking-food.component.html",
    styleUrls: ["./booking-food.component.scss"],
})
export class BookingFoodComponent extends BookingComponent {
    override completeDateAndTable(v: DateAndFlatTable) {
        this.dateAndTable = v;
        this.bookingStep = BookingStep.SelectFood;
    }

    completeSelectFoods(v: Foods) {
        this.foods = v;
        this.bookingStep = BookingStep.ExtraInfo;
    }
}
