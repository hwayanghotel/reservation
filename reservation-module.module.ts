import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReservationComponent } from "./reservation/reservation.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { RouterModule, Routes } from "@angular/router";
import { HolidayService } from "./service/holiday.service";
import { HttpClientModule } from "@angular/common/http";
import { DBService } from "./service/DB.service";
import { ContentFoodComponent } from "./calendar/content-food/content-food.component";

const routes: Routes = [{ path: "reservation", component: ReservationComponent }];

@NgModule({
    providers: [HolidayService, DBService, DatePipe],
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
        CommonModule,
        HttpClientModule,
    ],
    exports: [],
    declarations: [ReservationComponent, CalendarComponent, ContentFoodComponent],
})
export class ReservationModuleModule {}
