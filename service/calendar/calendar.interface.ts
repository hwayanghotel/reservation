import { CustomerInfo } from "reservation/booking/booking.component.interface";
import { BehaviorSubject } from "rxjs";

export interface ICalenderDB {
    [month: string]: {
        [date: string]: {
            cars: number;
            flatTable: number;
            dechTable: number;
            foods: number[]; //10:00,10:30,11:00...16:30, 14 length
        };
    };
}

export interface ICalendarService {
    calendarDB$: BehaviorSubject<ICalenderDB>;
    update(toBe: CustomerInfo, asIs?: CustomerInfo): Promise<void>;
}

export const CALENDAR_COLLECTION = "CALENDAR";
