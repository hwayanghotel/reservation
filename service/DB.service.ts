import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, take } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Moment from "moment";

export interface IDBService {
    // 고객정보
    id?: string;
    예약일?: string;
    예약시점?: string;
    성함?: string;
    전화번호?: string;
    // 예약정보
    예약유형?: "식사" | "평상" | "객실";
    인원?: number;
    상태?: "대기" | "예약" | "방문" | "수정" | "취소";
    차량번호?: string[];
    메모?: string;
    관리자메모?: string;
    // 객실정보
    객실?: "능운대" | "학소대" | "와룡암" | "첨성대";
    이용박수?: number;
    // 평상정보
    평상?: number;
    테이블?: number;
    입금확인?: boolean;
    // 식사정보
    예약시간?: number;
    능이백숙?: number;
    백숙?: number;
    버섯찌개?: number;
    버섯찌개2?: number;
}

export interface IReservationCalender {
    [month: string]: {
        [date: string]: {
            foods: number;
            flatBench: number;
            table: number;
        };
    };
}

const TEST = true;
export const COLLECTION = TEST ? "NY_TEST" : "PRD_NY_DB";
// const RESERVATION_CALLENDAR_COLLECTION = TEST ? "TEST_RESERAVTION_CALLENDAR" : "PRD_RESERAVTION_CALLENDAR";
const RESERVATION_CALLENDAR_COLLECTION = TEST ? "RESERVATION_CALLENDAR_COLLECTION" : "PRD_RESERAVTION_CALLENDAR";

@Injectable({
    providedIn: "root",
})
export class DBService {
    customerDB$: Observable<IDBService[]>;
    reservationCalendarDB$ = new BehaviorSubject<IReservationCalender>({});
    constructor(private http: HttpClient, private store: AngularFirestore) {
        // this.customerDB$ = this.store.collection(COLLECTION).valueChanges();
        this.customerDB$ = this.http.get("assets/fire.json") as Observable<IDBService[]>;
        this.customerDB$.subscribe((v) => {
            console.log("customerDB$ update", v);
            // this._updateCustomerCallendar(v);
        });

        this._setReservationCalendar();
    }

    async getDailyData(type: "식사" | "평상" | "객실", date: string): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.customerDB$.subscribe((db) => {
                resolve(db.filter((v) => v["예약유형"] === type && v["예약일"] === date));
            });
        });
    }

    add(model: IDBService) {
        this.store.collection(COLLECTION).add(model);
    }

    edit(model: IDBService) {
        // this.store.collection(COLLECTION).doc(model.id).update(model);
    }

    delete(id: string) {
        this.store.collection(COLLECTION).doc(id).delete();
    }

    search(model: IDBService): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.store
                .collection(COLLECTION)
                .ref.where("성함", "==", model["성함"])
                .where("전화번호", "==", model["전화번호"])
                .get()
                .then((snapshot) => {
                    let searchedList: IDBService[] = [];
                    snapshot.forEach((doc) => {
                        const passedNum = Object.entries(model).filter(
                            ([key, value]) => (doc.data() as any)[key] === value
                        );
                        if (passedNum.length === Object.keys(model).length) {
                            searchedList.push(doc.data());
                        }
                    });
                    searchedList = searchedList.filter((v) => v["예약일"] >= Moment().format("YYYY-MM-DD"));
                    resolve(searchedList);
                });
        });
    }

    managerSearch(model: IDBService): IDBService[] {
        let searchedList: IDBService[] = [];

        return searchedList;
    }

    private _setReservationCalendar() {
        this.store
            .collection(RESERVATION_CALLENDAR_COLLECTION)
            .get()
            .pipe(take(1))
            .subscribe((docs: any) => {
                let db: IReservationCalender = {};
                docs.forEach((doc: any) => {
                    db[doc.id] = doc.data;
                });
                this.reservationCalendarDB$.next(db);
            });
        this.reservationCalendarDB$.subscribe((v) => {
            console.warn("reservationCalendarDB", v);
        });
    }

    private _updateCustomerCallendar(DB: IDBService[]) {
        let reservationCalendar: IReservationCalender = {};
        DB.filter((value) => !["대기", "수정", "취소"].includes(value["상태"])).forEach((v) => {
            const month = v["예약일"].slice(0, 7);
            const date = v["예약일"];
            const foods = v["능이백숙"] + v["백숙"] + v["버섯찌개"] + v["버섯찌개2"];
            const flatBench = v["평상"];
            const table = v["테이블"];
            if (!foods && !flatBench && !table) {
                return;
            }

            if (!reservationCalendar[month]) {
                reservationCalendar[month] = {};
            }
            // if (!reservationCalendar[month][date]) {
            //     reservationCalendar[month][date] = {};
            // }
        });
    }
}
