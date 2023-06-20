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
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";

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
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatSnackBarModule,
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
