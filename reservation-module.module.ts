import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReservationComponent } from "./reservation/reservation.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { RouterModule, Routes } from "@angular/router";
import { HolidayService } from "./service/holiday/holiday.service";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [
  { path: "reservation", component: ReservationComponent },
];

@NgModule({
  providers: [HolidayService],
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
    CommonModule,
    HttpClientModule,
  ],
  exports: [],
  declarations: [ReservationComponent, CalendarComponent],
})
export class ReservationModuleModule {}
