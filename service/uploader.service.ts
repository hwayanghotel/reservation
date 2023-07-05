import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Moment from "moment";
import { take } from "rxjs";
import { COLLECTION, DBService, IDBService } from "./DB.service";

const googleCustomerInfoURL =
    "https://script.googleusercontent.com/macros/echo?user_content_key=stxTm3ZfpJF73WcKDT_zMWKpMf3-ntq6kIZkdauQjPgvnBXrSD20vM_oDCQLDW2rCE2UMyYVeZSSe_sLsIVYSELb-RBw8tcJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLomcEa3hQohhqGF9IQLKkOJ80D3btfuvhX3I2KuvHpzSC-uDYVcZemS8MX4vfT_5QU5C9RHcyaKoVaHbWyl27C5NMOy6dfG9w&lib=MU7evG46Af933laVWNSEneXXtad7F4Vk4";

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
    private currentDB: IDBService[] = [];
    constructor(private http: HttpClient, private store: AngularFirestore, private DBService: DBService) {
        this.DBService.firebaseStore$.subscribe((v) => {
            this.currentDB = v;
        });
    }

    uploadTest(action: boolean) {
        if (action) {
            const collectionRef = this.store.collection("NY_TEST");
            const batch = this.store.firestore.batch();

            this.http.get("assets/fire.json").subscribe((db) => {
                (db as object[]).forEach((v) => {
                    const docRef = collectionRef.doc().ref;
                    batch.set(docRef, v);
                });
                console.warn("uploadTest", batch);
                batch.commit();
            });
        }
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

                    const collectionRef = this.store.collection(COLLECTION);
                    const batch = this.store.firestore.batch();

                    for (let index = 0; index < db.length; index++) {
                        const data = db[index];
                        let uploadDB = {
                            예약유형: "객실",
                            객실: data[PENSION_DB["객실"]],
                            예약일: Moment(data[PENSION_DB["이용일"]]).format("YYYY-MM-DD"),
                            이용박수: data[PENSION_DB["이용박수"]],
                            상태: "예약",
                            성함: data[PENSION_DB["예약자"]],
                            전화번호: data[PENSION_DB["연락처"]],
                            예약시점: data[PENSION_DB["예약일"]],
                            입금확인: true,
                        };
                        const filteredList = this.currentDB.filter(
                            (v: IDBService) =>
                                v["예약유형"] === uploadDB["예약유형"] &&
                                v["객실"] === uploadDB["객실"] &&
                                v["예약일"] === uploadDB["예약일"] &&
                                v["성함"] === uploadDB["성함"] &&
                                v["예약시점"] === uploadDB["예약시점"]
                        );
                        if (filteredList.length === 0) {
                            const docRef = collectionRef.doc().ref;
                            batch.set(docRef, uploadDB);
                        }
                    }
                    batch.commit();
                });
        }
    }
}
