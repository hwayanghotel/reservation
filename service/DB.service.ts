import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, take } from "rxjs";
import { AngularFirestore, DocumentReference, QueryDocumentSnapshot } from "@angular/fire/compat/firestore";
import * as Moment from "moment";

export interface IUserDB {
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
    차량방문?: boolean[];
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
    수정내용?: IUserDB;
}

export interface ICalenderDB {
    [month: string]: {
        [date: string]: {
            foods?: number;
            flatBench?: number;
            table?: number;
        };
    };
}

export const USER_DB_COLLECTION = "USER_DB";
export const CALLENDAR_COLLECTION = "CALLENDAR";

@Injectable({
    providedIn: "root",
})
export class DBService {
    customerDB$: BehaviorSubject<IUserDB[]> = new BehaviorSubject<IUserDB[]>([]);
    calendarDB$ = new BehaviorSubject<ICalenderDB>({});

    constructor(private http: HttpClient, private store: AngularFirestore) {
        this._fetchCalenderDB();
        this.subscribeUserDB(); //Manager Component에서 호출하고 여기서는 지우는 걸로. (828 통과한 경우)
        // this._updateCustomerCallendar(); //Manager Component에서 호출한 이후에 활성화 가능 (828 통과한 경우)
    }

    subscribeUserDB() {
        if (this.customerDB$.getValue().length > 0) return;

        //날짜가 유효한 USER doc에 대해 sub을 걸고, 개별 변경 대응
        this.store
            .collection(USER_DB_COLLECTION)
            .ref.where("예약일", ">=", Moment().format("YYYY-MM-DD"))
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
                    if (["예약", "방문", "수정"].includes(doc.data()["상태"])) {
                        doc.ref.onSnapshot((v) => {
                            if (this.customerDB$.getValue().filter((user) => user["id"] === v.id)[0]) {
                                const index = this.customerDB$.getValue().findIndex((user) => user.id === v.id);
                                let changed = this.customerDB$.getValue();
                                changed[index] = v.data();
                                this.customerDB$.next(changed);
                            } else {
                                this.customerDB$.next([...this.customerDB$.getValue(), { id: v.id, ...v.data() }]);
                            }
                        });
                    }
                });
            });

        // 신규 DB(대기)는 새로 sub을 걸어야 해.
        this.store
            .collection(USER_DB_COLLECTION, (ref) => ref.where("상태", "==", "대기"))
            .snapshotChanges()
            .subscribe((actions) => {
                actions.forEach((action) => {
                    const data: any = action.payload.doc.data();
                    const id = action.payload.doc.id;
                    if (data["예약일"] >= Moment().format("YYYY-MM-DD")) {
                        if (this.customerDB$.getValue().filter((user) => user["id"] === id).length === 0) {
                            this.store
                                .collection(USER_DB_COLLECTION)
                                .doc(id)
                                .ref.onSnapshot((doc) => {
                                    if (this.customerDB$.getValue().filter((user) => user["id"] === doc.id)[0]) {
                                        const index = this.customerDB$
                                            .getValue()
                                            .findIndex((user) => user.id === doc.id);
                                        let changed = this.customerDB$.getValue();
                                        changed[index] = doc.data();
                                        this.customerDB$.next(changed);
                                    } else {
                                        this.customerDB$.next([
                                            ...this.customerDB$.getValue(),
                                            { id: doc.id, ...(doc.data() as object) },
                                        ]);
                                    }
                                });
                        }
                    }
                });
            });

        //TEST
        // this.customerDB$ = this.http.get("assets/fire.json") as Observable<IDBService[]>; // this.customerDB$ = this.store.collection(COLLECTION).valueChanges();
    }

    private _fetchCalenderDB() {
        this.store
            .collection(CALLENDAR_COLLECTION)
            .get()
            .pipe(take(1))
            .subscribe((docs: any) => {
                let db: ICalenderDB = {};
                docs.forEach((doc: any) => {
                    db[doc.id] = doc.data();
                });
                this.calendarDB$.next(db);
            });
    }

    add(model: IUserDB) {
        this.store
            .collection(USER_DB_COLLECTION)
            .add(model)
            .then((doc: DocumentReference) =>
                doc.get().then((newDB) => {
                    const month = newDB.data()["예약일"].slice(0, 7);
                    const date = newDB.data()["예약일"];
                    const foods =
                        (newDB.data()["능이백숙"] ? newDB.data()["능이백숙"] : 0) +
                        (newDB.data()["백숙"] ? newDB.data()["백숙"] : 0) +
                        (newDB.data()["버섯찌개"] ? newDB.data()["버섯찌개"] : 0) +
                        (newDB.data()["버섯찌개2"] ? newDB.data()["버섯찌개2"] : 0);
                    const flatBench = newDB.data()["평상"];
                    const table = newDB.data()["테이블"];
                    if (foods > 0 || flatBench > 0 || table > 0) {
                        let reservationCalendar = this.calendarDB$.getValue();
                        if (!reservationCalendar[month]) {
                            reservationCalendar[month] = {};
                        }
                        if (!reservationCalendar[month][date]) {
                            reservationCalendar[month][date] = {};
                        }
                        if (foods) {
                            if (reservationCalendar[month][date].foods) {
                                reservationCalendar[month][date].foods += foods;
                            } else {
                                reservationCalendar[month][date].foods = foods;
                            }
                        }
                        if (flatBench) {
                            if (reservationCalendar[month][date].flatBench) {
                                reservationCalendar[month][date].flatBench += flatBench;
                            } else {
                                reservationCalendar[month][date].flatBench = flatBench;
                            }
                        }
                        if (table) {
                            if (reservationCalendar[month][date].table) {
                                reservationCalendar[month][date].table += table;
                            } else {
                                reservationCalendar[month][date].table = table;
                            }
                        }
                        this.store
                            .collection(CALLENDAR_COLLECTION)
                            .doc(month)
                            .update(reservationCalendar[month])
                            .then((v) => {
                                console.warn("Callender가 정상적으로 업데이트 되었습니다.", v);
                            });
                    }
                })
            );
    }

    set(model: IUserDB) {
        const changed = model["수정내용"];
        model["수정내용"] = null;
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(model.id)
            .update(model)
            .then((v) => {
                const month = model["예약일"].slice(0, 7);
                const date = model["예약일"];
                const originalFoods =
                    (model["능이백숙"] ? model["능이백숙"] : 0) +
                    (model["백숙"] ? model["백숙"] : 0) +
                    (model["버섯찌개"] ? model["버섯찌개"] : 0) +
                    (model["버섯찌개2"] ? model["버섯찌개2"] : 0);
                const originalFlatBench = model["평상"] ? model["평상"] : 0;
                const originalTable = model["테이블"] ? model["테이블"] : 0;
                const changedFoods =
                    (changed["능이백숙"] ? changed["능이백숙"] : 0) +
                    (changed["백숙"] ? changed["백숙"] : 0) +
                    (changed["버섯찌개"] ? changed["버섯찌개"] : 0) +
                    (changed["버섯찌개2"] ? changed["버섯찌개2"] : 0);
                const changedFlatBench = changed["평상"] ? changed["평상"] : 0;
                const changedTable = changed["테이블"] ? changed["테이블"] : 0;

                const foods = changedFoods - originalFoods;
                const flatBench = changedFlatBench - originalFlatBench;
                const table = changedTable - originalTable;

                if (foods > 0 || flatBench > 0 || table > 0) {
                    let reservationCalendar = this.calendarDB$.getValue();
                    if (!reservationCalendar[month]) {
                        reservationCalendar[month] = {};
                    }
                    if (!reservationCalendar[month][date]) {
                        reservationCalendar[month][date] = {};
                    }
                    if (foods) {
                        if (reservationCalendar[month][date].foods) {
                            reservationCalendar[month][date].foods += foods;
                        } else {
                            reservationCalendar[month][date].foods = foods;
                        }
                    }
                    if (flatBench) {
                        if (reservationCalendar[month][date].flatBench) {
                            reservationCalendar[month][date].flatBench += flatBench;
                        } else {
                            reservationCalendar[month][date].flatBench = flatBench;
                        }
                    }
                    if (table) {
                        if (reservationCalendar[month][date].table) {
                            reservationCalendar[month][date].table += table;
                        } else {
                            reservationCalendar[month][date].table = table;
                        }
                    }
                    this.store
                        .collection(CALLENDAR_COLLECTION)
                        .doc(month)
                        .update(reservationCalendar[month])
                        .then((v) => {
                            console.warn("Callender가 정상적으로 업데이트 되었습니다.", v);
                        });
                }
            });
    }

    edit(after: any) {
        after["수정내용"] = {};
        const before: IUserDB = this.customerDB$.getValue().filter((v) => v.id === after.id)[0];
        Object.entries(before).forEach(([key, value]) => {
            if (
                value !== after[key] ||
                (["차량번호", "차량방문"].includes(key) &&
                    JSON.stringify(value.sort()) !== JSON.stringify(after[key].sort()))
            ) {
                after["수정내용"][key] = value;
            }
        });
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(after.id)
            .update(after)
            .then((v) => {
                console.warn("수정 상태가 되었습니다.", v);
            });
    }

    delete(id: string) {
        const model = this.customerDB$.getValue().filter((v) => v.id === id)[0];
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(id)
            .delete()
            .then(() => {
                const month = model["예약일"].slice(0, 7);
                const date = model["예약일"];
                const foods =
                    (model["능이백숙"] ? model["능이백숙"] : 0) +
                    (model["백숙"] ? model["백숙"] : 0) +
                    (model["버섯찌개"] ? model["버섯찌개"] : 0) +
                    (model["버섯찌개2"] ? model["버섯찌개2"] : 0);
                const flatBench = model["평상"];
                const table = model["테이블"];
                if (foods > 0 || flatBench > 0 || table > 0) {
                    let reservationCalendar = this.calendarDB$.getValue();
                    if (foods) {
                        reservationCalendar[month][date].foods -= foods;
                    }
                    if (flatBench) {
                        reservationCalendar[month][date].flatBench -= flatBench;
                    }
                    if (table) {
                        reservationCalendar[month][date].table -= table;
                    }
                    this.store
                        .collection(CALLENDAR_COLLECTION)
                        .doc(month)
                        .update(reservationCalendar[month])
                        .then((v) => {
                            console.warn("Callender가 정상적으로 업데이트 되었습니다.", v);
                        });
                }
            });
    }

    search(model: IUserDB): Promise<IUserDB[]> {
        return new Promise((resolve) => {
            this.store
                .collection(USER_DB_COLLECTION)
                .ref.where("성함", "==", model["성함"])
                .where("전화번호", "==", model["전화번호"])
                .get()
                .then((snapshot) => {
                    let searchedList: IUserDB[] = [];
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

    managerSearch(model: IUserDB): IUserDB[] {
        let searchedList: IUserDB[] = [];

        return searchedList;
    }

    private _updateCustomerCallendar() {
        setTimeout(() => {
            const DB = this.customerDB$.getValue();
            console.warn("DB", DB);
            let reservationCalendar: ICalenderDB = {};

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
                if (!reservationCalendar[month][date]) {
                    reservationCalendar[month][date] = {};
                }
                if (foods) {
                    if (reservationCalendar[month][date].foods) {
                        reservationCalendar[month][date].foods += foods;
                    } else {
                        reservationCalendar[month][date].foods = foods;
                    }
                }
                if (flatBench) {
                    if (reservationCalendar[month][date].flatBench) {
                        reservationCalendar[month][date].flatBench += flatBench;
                    } else {
                        reservationCalendar[month][date].flatBench = flatBench;
                    }
                }
                if (table) {
                    if (reservationCalendar[month][date].table) {
                        reservationCalendar[month][date].table += table;
                    } else {
                        reservationCalendar[month][date].table = table;
                    }
                }
            });
            Object.entries(reservationCalendar).forEach(([monthKey, monthData]) => {
                if (this.calendarDB$.getValue()[monthKey]) {
                    let needToUpdate = false;
                    Object.entries(monthData).forEach(([dailyKey, dailyData]) => {
                        if (
                            this.calendarDB$.getValue()[monthKey][dailyKey].flatBench !== dailyData.flatBench ||
                            this.calendarDB$.getValue()[monthKey][dailyKey].foods !== dailyData.foods ||
                            this.calendarDB$.getValue()[monthKey][dailyKey].table !== dailyData.table
                        ) {
                            needToUpdate = true;
                        }
                    });
                    console.warn("_updateCustomerCallendar", monthKey, monthData, needToUpdate);
                    if (needToUpdate) {
                        this.store.collection(CALLENDAR_COLLECTION).doc(monthKey).set(monthData);
                    }
                }
            });
        }, 5000);
    }
}
