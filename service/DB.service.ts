import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { AngularFirestore, QueryDocumentSnapshot } from "@angular/fire/compat/firestore";
import * as Moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface IUserDB {
    // 고객정보
    id?: string;
    예약일?: string;
    예약시점?: string;
    만료일?: string;
    성함?: string;
    전화번호?: string;
    // 예약정보
    예약유형?: "식사" | "평상" | "객실";
    인원?: number;
    상태?: "대기" | "예약" | "방문" | "완료" | "수정" | "취소";
    차량번호?: string[];
    차량방문?: boolean[];
    메모?: string;
    관리자메모?: string;
    // 객실정보
    객실?: string; //"능운대" | "학소대" | "와룡암" | "첨성대";
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

    constructor(private http: HttpClient, private store: AngularFirestore, private _snackBar: MatSnackBar) {
        this._fetchCalenderDB();
    }

    private _fetchCalenderDB() {
        this.store
            .collection(CALLENDAR_COLLECTION)
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

    add(model: IUserDB) {
        console.log("try add", model);
        this.store
            .collection(USER_DB_COLLECTION)
            .add(model)
            .catch((e) => {
                console.warn("add error", e);
                this._snackBar.open("예약 추가를 실패했습니다. 새로고침 후 다시 시도해주세요.", null, { duration: 2000 });
            });
    }

    set(model: IUserDB) {
        const changed = model["수정내용"];
        model = { ...model, ...changed };
        Object.entries(model).forEach(([key, value]) => {
            if (!value) {
                (model as any)[key] = null;
            }
        });
        console.log("Set", model);
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(model.id)
            .update(model)
            .then(() => console.log("set 성공", model))
            .catch((e) => {
                console.warn("set error", e);
                this._snackBar.open("SET을 실패했습니다. 새로고침 후 다시 시도해주세요.", null, { duration: 2000 });
            });
    }

    edit(changed: IUserDB | any) {
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(changed.id)
            .get()
            .subscribe((v) => {
                const user: IUserDB = { ...(v.data() as any), id: v.id, 상태: changed["상태"] };
                user["수정내용"] = {};
                changed["수정내용"] = {};

                Object.entries(user).forEach(([uKey, uValue]) => {
                    if (
                        uValue !== changed[uKey] ||
                        (["차량번호", "차량방문"].includes(uKey) && JSON.stringify(uValue.sort()) !== JSON.stringify(changed[uKey].sort()))
                    ) {
                        (user["수정내용"] as any)[uKey] = changed[uKey];
                    }
                });

                Object.entries(changed).forEach(([cKey, cValue]) => {
                    if (
                        cValue !== (user as any)[cKey] ||
                        (["차량번호", "차량방문"].includes(cKey) && JSON.stringify((cValue as any).sort()) !== JSON.stringify((user as any)[cKey].sort()))
                    ) {
                        if (!(user["수정내용"] as any)[cKey]) {
                            (user["수정내용"] as any)[cKey] = cValue;
                        }
                    }
                });
                console.log("edit", user);

                this.store
                    .collection(USER_DB_COLLECTION)
                    .doc(user.id)
                    .update(user)
                    .then(() => {
                        console.log("edit 성공");
                    })
                    .catch((e) => {
                        console.warn("edit error", e);
                        this._snackBar.open("예약 수정을 실패했습니다. 새로고침 후 다시 시도해주세요.", null, { duration: 2000 });
                    });
            });
    }

    delete(id: string) {
        const model = this.customerDB$.getValue().filter((v) => v.id === id)[0];
        this.store
            .collection(USER_DB_COLLECTION)
            .doc(id)
            .delete()
            .then(() => {
                //해당 DB 삭제
                this.customerDB$.next(
                    this.customerDB$
                        .getValue()
                        .filter((v) => v.id !== model.id)
                        .sort((a, b) => this._sortList(a, b))
                );
            })
            .catch((e) => {
                console.warn("delete error", e);
                this._snackBar.open("삭제를 실패했습니다. 새로고침 후 다시 시도해주세요.", null, { duration: 2000 });
            });
    }

    search(model: IUserDB): Promise<IUserDB[]> {
        return new Promise((resolve) => {
            console.log("search", model);
            const snapShot = model.id
                ? this.store.collection(USER_DB_COLLECTION).ref.where("id", "==", model.id).get()
                : this.store.collection(USER_DB_COLLECTION).ref.where("성함", "==", model["성함"]).where("전화번호", "==", model["전화번호"]).get();
            snapShot
                .then((snapshot) => {
                    let searchedList: IUserDB[] = [];
                    snapshot.forEach((doc) => {
                        const passedNum = Object.entries(model).filter(([key, value]) => (doc.data() as any)[key] === value);
                        if (passedNum.length === Object.keys(model).length) {
                            searchedList.push({ ...(doc.data() as any), id: doc.id });
                        }
                    });
                    searchedList = searchedList.filter((v) => v["만료일"] >= Moment().format("YYYY-MM-DD"));
                    console.log("search result:", searchedList);
                    resolve(searchedList);
                })
                .catch((e) => {
                    console.warn("search error", e);
                    this._snackBar.open("검색을 실패했습니다. 새로고침 후 다시 시도해주세요.", null, { duration: 2000 });
                });
        });
    }

    subscribeUserDB() {
        if (this.customerDB$.getValue().length > 0) return;

        //날짜가 유효한 USER doc에 대해 sub을 걸고, 개별 변경 대응
        this.store
            .collection(USER_DB_COLLECTION)
            .ref.where("만료일", ">=", Moment().format("YYYY-MM-DD"))
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
                    if (["예약", "방문", "완료", "수정", "취소"].includes(doc.data()["상태"])) {
                        doc.ref.onSnapshot((v) => {
                            if (this.customerDB$.getValue().filter((user) => user["id"] === v.id)[0]) {
                                const index = this.customerDB$.getValue().findIndex((user) => user.id === v.id);
                                let changed = this.customerDB$.getValue();
                                changed[index] = v.data();
                                changed = changed.filter((item) => item);
                                this.customerDB$.next(changed.sort((a, b) => this._sortList(a, b)));
                            } else {
                                this.customerDB$.next([...this.customerDB$.getValue(), { id: v.id, ...v.data() }].sort((a, b) => this._sortList(a, b)));
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
                    if (data["만료일"] >= Moment().format("YYYY-MM-DD")) {
                        if (this.customerDB$.getValue().filter((user) => user["id"] === id).length === 0) {
                            this.store
                                .collection(USER_DB_COLLECTION)
                                .doc(id)
                                .ref.onSnapshot((doc) => {
                                    if (this.customerDB$.getValue().filter((user) => user["id"] === doc.id)[0]) {
                                        const index = this.customerDB$.getValue().findIndex((user) => user.id === doc.id);
                                        let changed = this.customerDB$.getValue();
                                        changed[index] = doc.data();
                                        changed = changed.filter((item) => item);
                                        this.customerDB$.next(changed.sort((a, b) => this._sortList(a, b)));
                                    } else {
                                        this.customerDB$.next(
                                            [...this.customerDB$.getValue(), { id: doc.id, ...(doc.data() as object) }].sort((a, b) => this._sortList(a, b))
                                        );
                                    }
                                });
                        }
                    }
                });
            });
        // this.customerDB$ = this.http.get("assets/fire.json") as Observable<IDBService[]>; // this.customerDB$ = this.store.collection(COLLECTION).valueChanges();
    }

    private _sortList(a: IUserDB, b: IUserDB) {
        // 1) "날짜"가 빠를수록 정렬
        const dateA = new Date(a["예약일"]);
        const dateB = new Date(b["예약일"]);
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        // 2) "상태"가 "대기" > "수정" > "예약" > "방문" > "완료" > "취소" 순서로 정렬
        const statusOrder = {
            대기: 0,
            수정: 1,
            예약: 2,
            방문: 3,
            완료: 4,
            취소: 5,
        };
        const statusA = statusOrder[a["상태"]];
        const statusB = statusOrder[b["상태"]];
        if (statusA < statusB) {
            return -1;
        }
        if (statusA > statusB) {
            return 1;
        }

        return 0; // 동일한 경우 유지
    }
}
