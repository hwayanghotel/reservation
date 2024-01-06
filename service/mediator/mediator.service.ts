import { Injectable } from "@angular/core";
import { CustomerInfo } from "reservation/booking/booking.component.interface";

@Injectable({
    providedIn: "root",
})
export class MediatorService {
    customerInfo: CustomerInfo;
    constructor() {}
}
