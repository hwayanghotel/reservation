import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { CALENDAR_COLLECTION, ICalendarService, ICalenderDB } from "./calendar.interface";
import { BehaviorSubject } from "rxjs";
import { CustomerInfo } from "reservation/booking/booking.component.interface";

@Injectable({
    providedIn: "root",
})
export class CalendarService implements ICalendarService {
    calendarDB$ = new BehaviorSubject<ICalenderDB>({});
    constructor(private store: AngularFirestore) {
        this._fetchCalenderDB();
    }

    private _fetchCalenderDB() {
        this.store
            .collection(CALENDAR_COLLECTION)
            .valueChanges()
            .subscribe((docs: any) => {
                let db: ICalenderDB = {};
                docs.forEach((doc: any) => {
                    const key = Object.keys(doc)[0].slice(0, 4);
                    db[key] = doc;
                });
                this.calendarDB$.next(db);
            });
    }

    update(toBe: CustomerInfo, asIs?: CustomerInfo): Promise<void> {
        const month = toBe.date.format("YYMM");
        const date = toBe.date.format("YYMMDD");
        let target = this._getTarget(month, date);
        let cars = toBe.cars.length;
        let flatTable = toBe.status === "cancel" ? 0 : toBe.flatTable;
        let dechTable = toBe.status === "cancel" ? 0 : toBe.dechTable;
        let foods = this._getFoods(toBe);

        if (asIs && asIs.status !== "cancel") {
            cars -= asIs.cars.length;
            flatTable -= asIs.flatTable;
            dechTable -= asIs.dechTable;
            foods = foods.map((item, index) => item - (this._getFoods(asIs)[index] || 0));
        }
        target[month][date].cars += cars;
        target[month][date].flatTable += flatTable;
        target[month][date].dechTable += dechTable;
        target[month][date].foods = target[month][date].foods.map((item, index) => item + (foods[index] || 0));
        return this.store.collection(CALENDAR_COLLECTION).doc(month).set(target[month]);
    }

    private _getTarget(month: string, date: string): ICalenderDB {
        let target: ICalenderDB = this.calendarDB$.getValue();
        if (!target) {
            target = {};
        }
        if (!target[month]) {
            target[month] = {};
        }
        if (!target[month][date]) {
            target[month][date] = {
                cars: 0,
                flatTable: 0,
                dechTable: 0,
                foods: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            };
        }
        return target;
    }

    private _getFoods(user: CustomerInfo): number[] {
        let target = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const foods = (user.mushroomStew | 0) + (user.mushroomStewForTwoPeople | 0) + (user.neungiBaeksuk | 0) + (user.baeksuk | 0);
        if (foods === 0 || user.status === "cancel") {
            return target;
        }

        const index = (Number(user.date.format("HH")) - 10) * 2 + Number(user.date.format("mm")) / 30;
        target[index] = foods;
        return target;
    }
}
