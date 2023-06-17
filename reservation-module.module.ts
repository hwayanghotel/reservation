import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReservationComponent } from "./reservation/reservation.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { RouterModule, Routes } from "@angular/router";
import { HolidayService } from "./service/holiday.service";
import { HttpClientModule } from "@angular/common/http";
import { DBService } from "./service/DB.service";
import { ContentFoodComponent } from "./calendar/content-food/content-food.component";
import { ContentFlatBenchComponent } from "./calendar/content-flat-bench/content-flat-bench.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ReservationFormComponent } from "./reservation/reservation-form/reservation-form.component";
import { ReservationService } from "./service/reservation.service";

const routes: Routes = [{ path: "reservation", component: ReservationComponent }];

@NgModule({
    providers: [HolidayService, DBService, ReservationService, DatePipe],
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
        CommonModule,
        HttpClientModule,
        MatDialogModule,
    ],
    exports: [],
    declarations: [
        ReservationComponent,
        ReservationFormComponent,
        CalendarComponent,
        ContentFoodComponent,
        ContentFlatBenchComponent,
    ],
})
export class ReservationModuleModule {}
