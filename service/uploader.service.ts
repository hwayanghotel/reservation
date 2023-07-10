import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Moment from "moment";
import { take } from "rxjs";
import { USER_DB_COLLECTION, DBService, IUserDB } from "./DB.service";

const googleCustomerInfoURL =
    "https://script.google.com/macros/s/AKfycbyoZd2TMdGJl8UISn0V7LhA3uoN3D9keTYru2SPiPiTJnCgFeHdpP1HRTTwxCnotxZ8/exec";

const pensionCallendarURL =
    "https://booking.ddnayo.com/booking-calendar-api/calendar/accommodation/12342/reservation-calendar?month=202307&calendarTypeCode=PRICE_CALENDAR&zoneIds=";

enum PENSION_DB {
    예약번호,
    업소명,
    객실,
    예약일,
    경로,
    유입,
    예약자,
    연락처,
    이용일,
    이용박수,
    결제액,
    정산금액,
    정산상태,
    결제구분,
    예약상태,
}

interface GoogleSheetData {
    GoogleSheetData: [];
}

@Injectable({
    providedIn: "root",
})
export class UploaderService {
    private currentDB: IUserDB[] = [];
    constructor(private http: HttpClient, private store: AngularFirestore, private DBService: DBService) {
        this.DBService.customerDB$.subscribe((v) => {
            this.currentDB = v;
        });
    }

    uploadPensionDB(action: boolean) {
        if (action) {
            this.http
                .get(googleCustomerInfoURL)
                .pipe(take(1))
                .subscribe((v) => {
                    const db = (v as GoogleSheetData)["GoogleSheetData"].filter(
                        (db) => db[PENSION_DB["예약상태"]] !== "예약취소"
                    );

                    const collectionRef = this.store.collection(USER_DB_COLLECTION);
                    const batch = this.store.firestore.batch();
                    let uploadDBList = [];

                    for (let index = 1; index < db.length; index++) {
                        const data = db[index];
                        let uploadDB = {
                            예약유형: "객실",
                            객실: data[PENSION_DB["객실"]],
                            예약일: Moment(data[PENSION_DB["이용일"]]).format("YYYY-MM-DD"),
                            이용박수: data[PENSION_DB["이용박수"]],
                            만료일: Moment(data[PENSION_DB["이용일"]])
                                .add(data[PENSION_DB["이용박수"]], "days")
                                .format("YYYY-MM-DD"),
                            상태: "예약",
                            성함: data[PENSION_DB["예약자"]],
                            전화번호: data[PENSION_DB["연락처"]],
                            예약시점: data[PENSION_DB["예약일"]],
                            입금확인: true,
                        };
                        const filteredList = this.currentDB.filter(
                            (v: IUserDB) =>
                                v["예약유형"] === uploadDB["예약유형"] &&
                                v["객실"] === uploadDB["객실"] &&
                                v["예약일"] === uploadDB["예약일"] &&
                                v["성함"] === uploadDB["성함"] &&
                                v["예약시점"] === uploadDB["예약시점"]
                        );
                        if (filteredList.length === 0) {
                            uploadDBList.push(uploadDB);
                        }
                    }

                    let mergedDBList: any[] = [];
                    uploadDBList.forEach((db) => {
                        let foundItem = mergedDBList.find(
                            (mergedDB: any) =>
                                mergedDB["성함"] === db["성함"] &&
                                mergedDB["전화번호"] === db["전화번호"] &&
                                mergedDB["이용박수"] === db["이용박수"]
                        );
                        if (foundItem) {
                            foundItem["객실"] = `${foundItem["객실"]}, ${db["객실"]}`;
                            let sortedRooms: string;
                            ["능운대", "학소대", "와룡암", "첨성대"].forEach((room) => {
                                if (foundItem["객실"].includes(room)) {
                                    if (sortedRooms) {
                                        sortedRooms = `${sortedRooms}, ${room}`;
                                    } else {
                                        sortedRooms = room;
                                    }
                                }
                            });
                            foundItem["객실"] = sortedRooms;
                        } else {
                            mergedDBList.push(db);
                        }
                    });

                    console.warn("uploadPensionDB", mergedDBList);

                    mergedDBList.forEach((db) => {
                        const docRef = collectionRef.doc().ref;
                        batch.set(docRef, db);
                    });
                    if (mergedDBList.length > 0) {
                        batch.commit();
                    }
                });
        }
    }

    uploadTest(action: boolean) {
        if (action) {
            const collectionRef = this.store.collection("USER_DB");
            const batch = this.store.firestore.batch();

            this.http.get("assets/fire2.json").subscribe((db) => {
                (db as object[]).forEach((v) => {
                    const docRef = collectionRef.doc().ref;
                    batch.set(docRef, v);
                });
                console.warn("uploadTest", batch);
                batch.commit();
            });
        }
    }
}
