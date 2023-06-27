import { NgModule, forwardRef } from "@angular/core";
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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Step1Component } from "./reservation/reservation-form/step1/step1.component";
import { Step2Component } from "./reservation/reservation-form/step2/step2.component";
import { Step3Component } from "./reservation/reservation-form/step3/step3.component";
import { Step4Component } from "./reservation/reservation-form/step4/step4.component";
import { Step5Component } from "./reservation/reservation-form/step5/step5.component";
import { Step6Component } from "./reservation/reservation-form/step6/step6.component";
import { Step7Component } from "./reservation/reservation-form/step7/step7.component";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { ReservationDialogComponent } from "./reservation-dialog/reservation-dialog.component";
import { DialogForCarAndMemoComponent } from "./reservation-dialog/dialog-for-car-and-memo/dialog-for-car-and-memo.component";
import { DialogForCustomerInfoComponent } from "./reservation-dialog/dialog-for-customer-info/dialog-for-customer-info.component";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { FormFieldCustomControlExample } from "./reservation-dialog/form-field-custom-control-example/form-field-custom-control-example.component";
import { DialogForFlatbenchComponent } from "./reservation-dialog/dialog-for-flatbench/dialog-for-flatbench.component";
import { DialogForFoodComponent } from "./reservation-dialog/dialog-for-food/dialog-for-food.component";
import { DialogForTypeAndDateComponent } from "./reservation-dialog/dialog-for-type-and-date/dialog-for-type-and-date.component";
import { DialogForReservationConfirmationComponent } from "./reservation-dialog/dialog-for-reservation-confirmation/dialog-for-reservation-confirmation.component";
import { DialogReservationCancelComponent } from "./reservation-dialog/dialog-reservation-cancel/dialog-reservation-cancel.component";

const routes: Routes = [{ path: "reservation", component: ReservationComponent }];

@NgModule({
    providers: [
        HolidayService,
        DBService,
        ReservationService,
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                display: {
                    dateInput: "YY.MM.DD",
                    monthYearLabel: "YY.MM.DD",
                },
            },
        },
    ],
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        forwardRef(() => FormFieldCustomControlExample),
    ],
    exports: [],
    declarations: [
        ReservationComponent,
        ReservationFormComponent,
        CalendarComponent,
        ContentFoodComponent,
        ContentFlatBenchComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        Step4Component,
        Step5Component,
        Step6Component,
        Step7Component,
        ReservationDialogComponent,
        DialogForTypeAndDateComponent,
        DialogForCustomerInfoComponent,
        DialogForFlatbenchComponent,
        DialogForFoodComponent,
        DialogForCarAndMemoComponent,
        DialogForReservationConfirmationComponent,
        DialogReservationCancelComponent,
    ],
})
export class ReservationModule {}
