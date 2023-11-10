import { CustomerInfo } from "reservation/booking/booking.interface";

export interface IBookingService {
    add(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    update(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    cancel(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    delete(id: string): Promise<string>;
    search(id: string, name: string): Promise<CustomerInfo>;
}

export const BOOKING_COLLECTION = "BOOKING";
