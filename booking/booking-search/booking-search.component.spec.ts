/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { BookingSearchComponent } from "./booking-search.component";

describe("BookingSearchComponent", () => {
    let component: BookingSearchComponent;
    let fixture: ComponentFixture<BookingSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookingSearchComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
