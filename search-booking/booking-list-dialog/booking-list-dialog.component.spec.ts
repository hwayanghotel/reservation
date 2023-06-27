/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { BookingListDialogComponent } from "./booking-list-dialog.component";

describe("BookingListComponent", () => {
    let component: BookingListDialogComponent;
    let fixture: ComponentFixture<BookingListDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookingListDialogComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingListDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
