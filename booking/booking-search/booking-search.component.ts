import { Component, OnInit } from "@angular/core";
import { BookingDateComponent } from "../booking-date/booking-date.component";
import { HolidayService } from "reservation/service/holiday/holiday.service";
import { BookingService } from "reservation/service/booking/booking.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CalendarService } from "reservation/service/calendar/calendar.service";
import { MediatorService } from "reservation/service/mediator/mediator.service";
import { ActivatedRoute, Router } from "@angular/router";

interface SearchInfo {
    name: string;
    id: number;
}

@Component({
    selector: "booking-search",
    templateUrl: "./booking-search.component.html",
    styleUrls: ["./booking-search.component.scss"],
})
export class BookingSearchComponent extends BookingDateComponent implements OnInit {
    searchInfo: SearchInfo = { name: "", id: undefined };

    constructor(
        holidayService: HolidayService,
        calendarService: CalendarService,
        private bookingService: BookingService,
        private snackBar: MatSnackBar,
        private mediatorService: MediatorService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(holidayService, calendarService);
    }
    ngOnInit(): void {
        this.route.queryParams.subscribe((parameter) => {
            const id = parameter["id"];
            if (id) {
                this.searchInfo.id = id;
                this.onNextButton();
            }
        });
    }

    override onBackButton() {
        window.history.back();
    }

    override onNextButton() {
        this.bookingService
            .search(this.searchInfo.id.toString())
            .then((info) => {
                this.mediatorService.customerInfo = info as any;
                this.router.navigate(["/booking-confirmed"]);
            })
            .catch((e) => {
                console.error("예약 검색 실패", this.searchInfo.id, e);
                this.snackBar.open("검색을 실패했습니다. 다시 시도해주세요.", null, { duration: 2000 });
            });
    }
}
