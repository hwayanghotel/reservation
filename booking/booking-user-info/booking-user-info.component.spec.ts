/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { BookingUserInfoComponent } from "./booking-user-info.component";

describe("BookingCustomerInfoComponent", () => {
    let component: BookingUserInfoComponent;
    let fixture: ComponentFixture<BookingUserInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookingUserInfoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingUserInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
