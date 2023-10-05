/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { BookingExtraInfoComponent } from "./booking-extra-info.component";

describe("BookingCustomerInfoComponent", () => {
    let component: BookingExtraInfoComponent;
    let fixture: ComponentFixture<BookingExtraInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookingExtraInfoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingExtraInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
