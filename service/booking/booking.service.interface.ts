import { CustomerInfo } from "reservation/booking/booking.component.interface";

export interface IBookingService {
    add(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    update(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    cancel(bookingInfo: CustomerInfo): Promise<CustomerInfo>;
    delete(id: string): Promise<string>;
    search(id: string, name: string): Promise<CustomerInfo>;
}

export const VacationMonths = [12, 1, 2];

export const BOOKING_COLLECTION = "BOOKING";

export const MAX_BOOKING = {
    foodTable: 16,
    flatTable: 6,
    dechTable: 6,
    parking: 40,
};

export const STANDARD_BOOKING = {
    foodTableGuests: {
        std: 4,
        max: 5,
    },
    flatTableGuests: {
        std: 4,
        max: 7,
    },
    dechTableGuests: {
        std: 4,
        max: 7,
    },
};

export const Price = {
    평상: 50000,
    데크: 40000,
    평상추가인원: 10000,
    능이백숙: 90000,
    백숙: 70000,
    버섯찌개: 60000,
    버섯찌개2: 40000,
    더덕구이: 30000,
    파전: 20000,
    묵: 15000,
    동동주: 10000,
    막걸리: 5000,
    주류: 5000,
};
