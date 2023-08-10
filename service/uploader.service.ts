import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Moment from "moment";
import { take } from "rxjs";
import { USER_DB_COLLECTION, DBService, IUserDB, ICalenderDB, CALLENDAR_COLLECTION } from "./DB.service";

const googlePensionInfoURL = "https://script.google.com/macros/s/AKfycby0tNVTzNLtaSSHjomtf9NtDm7kAKBrBAt9W9xUj8cL_gTE3RNxjcp7-a_nc3H0ZY0m/exec";

const googleOtherBoolingInfoURL = "https://script.google.com/macros/s/AKfycbzhxcY9prULQIaFwY5OAolzBeRcxZ3cNmZsDlN7sbOpMlR59-drhbys6Zgd4Ny3o6eR/exec";

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

enum BOOKING_DB {
    예약일,
    성함,
    전화번호,
    예약유형,
    인원,
    상태,
    차량번호,
    객실,
    이용박수,
    평상,
    테이블,
    입금확인,
    예약시간,
    능이백숙,
    백숙,
    버섯찌개,
    버섯찌개2,
    관리자메모,
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
                .get(googlePensionInfoURL)
                .pipe(take(1))
                .subscribe((v) => {
                    const db = (v as GoogleSheetData)["GoogleSheetData"].filter((db) => db[PENSION_DB["예약상태"]] === "결제완료");

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
                            만료일: Moment(data[PENSION_DB["이용일"]]).add(data[PENSION_DB["이용박수"]], "days").format("YYYY-MM-DD"),
                            상태: "예약",
                            성함: data[PENSION_DB["예약자"]],
                            전화번호: data[PENSION_DB["연락처"]],
                            예약시점: data[PENSION_DB["예약일"]],
                            입금확인: true,
                        };
                        const filteredList = this.currentDB.filter(
                            (v: IUserDB) =>
                                v["예약유형"] === uploadDB["예약유형"] &&
                                v["예약일"] === uploadDB["예약일"] &&
                                v["성함"] === uploadDB["성함"] &&
                                v["전화번호"] === uploadDB["전화번호"]
                        );
                        if (filteredList.length === 0 && uploadDB["만료일"] >= Moment().format("YYYY-MM-DD")) {
                            uploadDBList.push(uploadDB);
                        }
                    }

                    let mergedDBList: any[] = [];
                    uploadDBList.forEach((db) => {
                        let foundItem = mergedDBList.find(
                            (mergedDB: any) =>
                                mergedDB["성함"] === db["성함"] && mergedDB["전화번호"] === db["전화번호"] && mergedDB["이용박수"] === db["이용박수"]
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

    uploadOtherBookingInfo(action: boolean) {
        if (action) {
            this.http
                .get(googleOtherBoolingInfoURL)
                .pipe(take(1))
                .subscribe((v) => {
                    const db = (v as GoogleSheetData)["GoogleSheetData"];

                    const collectionRef = this.store.collection(USER_DB_COLLECTION);
                    const batch = this.store.firestore.batch();
                    let uploadDBList = [];

                    for (let index = 1; index < db.length; index++) {
                        const data = db[index];

                        Object.entries(data).forEach(([key, value]) => {
                            if (["", undefined, null].includes(value as any)) {
                                delete data[key];
                            }
                        });

                        let uploadDB: any = {};
                        if (data[BOOKING_DB["예약일"]]) {
                            uploadDB["예약일"] = Moment(data[BOOKING_DB["예약일"]]).format("YYYY-MM-DD");
                            uploadDB["만료일"] = Moment(data[BOOKING_DB["예약일"]]).add(data[BOOKING_DB["이용박수"]], "days").format("YYYY-MM-DD");
                        }
                        if (data[BOOKING_DB["차량번호"]]) {
                            uploadDB["차량번호"] = (data[BOOKING_DB["차량번호"]] as string).replace(" ", "").split(",");
                        }

                        for (let key of [
                            "성함",
                            "전화번호",
                            "예약유형",
                            "인원",
                            "상태",
                            "객실",
                            "이용박수",
                            "평상",
                            "테이블",
                            "예약시간",
                            "능이백숙",
                            "백숙",
                            "버섯찌개",
                            "버섯찌개2",
                            "관리자메모",
                        ]) {
                            if (data[BOOKING_DB[key as any]]) {
                                uploadDB[key] = data[BOOKING_DB[key as any]];
                            }
                        }

                        const filteredList = this.currentDB.filter(
                            (v: IUserDB) =>
                                v["예약일"] === uploadDB["예약일"] &&
                                v["전화번호"] === uploadDB["전화번호"] &&
                                v["성함"] === uploadDB["성함"] &&
                                v["예약유형"] === uploadDB["예약유형"] &&
                                v["인원"] === uploadDB["인원"]
                        );
                        if (filteredList.length === 0) {
                            uploadDBList.push(uploadDB);
                        }
                    }

                    let mergedDBList: any[] = [];
                    uploadDBList.forEach((db) => {
                        let foundItem = mergedDBList.find(
                            (mergedDB: any) =>
                                mergedDB["성함"] === db["성함"] && mergedDB["전화번호"] === db["전화번호"] && mergedDB["이용박수"] === db["이용박수"]
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

                    console.warn("uploadOtherBookingInfo", mergedDBList);

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

    uploadCalenderDB() {
        let calendarDB: ICalenderDB = {};

        this.DBService.customerDB$
            .getValue()
            .filter((v) => ["예약", "방문"].includes(v["상태"]))
            .forEach((user: IUserDB) => {
                const month = Moment(user["예약일"]).format("YYMM");
                const date = Moment(user["예약일"]).format("YYMMDD");

                if (!calendarDB[month]) {
                    calendarDB[month] = {};
                }
                if (!calendarDB[month][date]) {
                    calendarDB[month][date] = {
                        flatBench: 0,
                        table: 0,
                        foods: 0,
                    };
                }
                calendarDB[month][date].flatBench += user["평상"] | 0;
                calendarDB[month][date].table += user["테이블"] | 0;
                if (user["예약유형"] === "식사") {
                    calendarDB[month][date].foods += (user["능이백숙"] | 0) + (user["백숙"] | 0) + (user["버섯찌개"] | 0) + (user["버섯찌개2"] | 0);
                }
            });

        Object.entries(calendarDB).forEach(([key, value]) => {
            this.store
                .collection(CALLENDAR_COLLECTION)
                .doc(key)
                .set(value)
                .then(() => {
                    console.log("calenderDB 업로드 성공", key);
                })
                .catch((e) => {
                    console.log("calenderDB 업로드 실패", key, e);
                });
        });
    }
}
