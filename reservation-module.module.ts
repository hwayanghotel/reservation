import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReservationComponent } from "./reservation/reservation.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "reservation", component: ReservationComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
    CommonModule,
  ],
  declarations: [ReservationComponent, CalendarComponent],
})
export class ReservationModuleModule {}
