import { Component } from "@angular/core";
import { BookingDateComponent } from "../booking-date/booking-date.component";
import { HolidayService } from "reservation/service/holiday/holiday.service";
import { BookingService } from "reservation/service/booking/booking.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerInfo } from "../booking.component.interface";
import { CalendarService } from "reservation/service/calendar/calendar.service";

interface SearchInfo {
    name: string;
    id: number;
}

enum BookingSearchStatus {
    search,
    confirmation,
}

@Component({
    selector: "booking-search",
    templateUrl: "./booking-search.component.html",
    styleUrls: ["./booking-search.component.scss"],
})
export class BookingSearchComponent extends BookingDateComponent {
    searchInfo: SearchInfo = { name: "", id: undefined };
    customerInfo: CustomerInfo;
    BookingSearchStatus = BookingSearchStatus;
    status: BookingSearchStatus = BookingSearchStatus.search;

    constructor(holidayService: HolidayService, calendarService: CalendarService, private bookingService: BookingService, private snackBar: MatSnackBar) {
        super(holidayService, calendarService);
    }
    override onBackButton() {
        window.history.back();
    }

    override onNextButton() {
        this.bookingService
            .search(this.searchInfo.id.toString(), this.searchInfo.name)
            .then((info) => {
                this.customerInfo = info as any;
                this.status = BookingSearchStatus.confirmation;
            })
            .catch((e) => {
                console.error("예약 검색 실패", this.searchInfo.id, e);
                this.snackBar.open("검색을 실패했습니다. 다시 시도해주세요.", null, { duration: 2000 });
            });
    }

    backStep() {
        this.status = BookingSearchStatus.search;
    }
}
