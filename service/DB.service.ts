import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as Moment from "moment";

export interface IDBService {
    id?: string;
    날짜: string;
    예약시점: string;
    시간?: number;
    예약유형: "식사" | "평상" | "객실";
    객실: "능운대" | "학소대" | "와룡암" | "첨성대";
    이용박수: number;
    상태: "대기" | "예약" | "방문" | "수정" | "취소";
    성함: string;
    인원: number;
    전화번호: string;
    차량번호: string[];
    평상?: number;
    테이블?: number;
    능이백숙?: number;
    백숙?: number;
    버섯찌개?: number;
    버섯찌개2?: number;
    입금확인: boolean;
    메모: string;
    관리자메모: string;
}

const COLLECTION = "hwayanghotel";

@Injectable({
    providedIn: "root",
})
export class DBService {
    firebaseStore$: Observable<any[]>;
    constructor(private http: HttpClient, private store: AngularFirestore) {
        // this.store
        //     .collection(COLLECTION)
        //     .get()
        //     .subscribe((v: QuerySnapshot<any>) => {
        //         console.warn("요건 get이야", v.docs[1].data());
        //     });
        this.firebaseStore$ = this.http.get("assets/fire.json") as Observable<any[]>;
        // this._setPensionDB();

        // this.http.get("assets/fire.json").subscribe((v) => {
        //     this.store.collection(COLLECTION).add({
        //         id: "1",
        //         data: v,
        //     });
        // });
    }

    async getDailyData(type: "식사" | "평상" | "객실", date: string): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.firebaseStore$.subscribe((db) => {
                resolve(db.filter((v) => v["예약유형"] === type && v["날짜"] === date));
            });
        });
    }

    add(model: IDBService) {
        // this.store.collection(COLLECTION).add(model);
    }

    edit(model: IDBService) {
        // this.store.collection(COLLECTION).doc(model.id).update(model);
    }

    delete(id: string) {
        // this.store.collection(COLLECTION).doc(id).delete();
    }

    search(id: string, model: IDBService, excludes?: string[]): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.firebaseStore$.subscribe((data) => {
                if (id) {
                    resolve(data.filter((v) => v.id === id));
                }
                if (!excludes || !excludes.includes("날짜")) {
                    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                    data = data.filter((v) => new Date(v["날짜"]) >= today);
                }
                if (!excludes || !excludes.includes("상태")) {
                    data = data.filter((v) => v["상태"] !== "취소");
                }
                if (model["예약유형"]) {
                    data = data.filter((v) => v["예약유형"] === model["예약유형"]);
                }
                if (model["성함"]) {
                    data = data.filter((v) => v["성함"] === model["성함"]);
                }
                if (model["전화번호"]) {
                    data = data.filter((v) => v["전화번호"] === model["전화번호"]);
                }
                if (model["날짜"]) {
                    data = data.filter((v) => v["날짜"] === model["날짜"]);
                }
                resolve(data);
            });
        });
    }

    private _setPensionDB() {
        setTimeout(() => {
            let result: IDBService[] = [];
            this.http.get("assets/pension.json").subscribe((v) => {
                const db = (v as GoogleSheetData)["GoogleSheetData"].filter(
                    (db) => db[PENSION_DB["예약상태"]] !== "예약취소"
                );
                for (let index = 0; index < db.length; index++) {
                    const data = db[index];
                    let uploadDB: IDBService = {
                        예약유형: "객실",
                        객실: data[PENSION_DB["객실"]],
                        날짜: Moment(data[PENSION_DB["이용일"]]).format("YYYY-MM-DD"),
                        이용박수: data[PENSION_DB["이용박수"]],
                        시간: null,
                        상태: "예약",
                        성함: data[PENSION_DB["예약자"]],
                        인원: 0,
                        전화번호: data[PENSION_DB["연락처"]],
                        차량번호: ["null"],
                        메모: null,
                        평상: 0,
                        테이블: 0,
                        능이백숙: 0,
                        백숙: 0,
                        버섯찌개: 0,
                        버섯찌개2: 0,
                        예약시점: data[PENSION_DB["예약일"]],
                        입금확인: true,
                        관리자메모: null,
                    };
                    console.warn("upload", uploadDB);
                    // this.store.collection(COLLECTION).add(uploadDB);
                }
            });
        }, 1000);
    }
}

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

// this.http.get("assets/fire.json").subscribe((v: any) => {
//   let index = 0;
//   let col = [];
//   let resultList: any = [];
//   for (let value of v) {
//       if (index === 0) {
//           col = value;
//       } else {
//           let result: any = {};
//           for (let i = 0; i < value.length; i++) {
//               result[col[i]] = value[i];
//           }
//           resultList.push(result);
//       }
//       index++;
//   }
//   console.warn(resultList);

//   for (let result of resultList) {
//       this.store.collection(COLLECTION).add(result);
//   }
// });

const googleCustomerInfoURL =
    "https://script.googleusercontent.com/macros/echo?user_content_key=tD3vWggTYboZyxXnSB66Y9xL3e5kA-TRlsHVDMpC973AjZXa7OBFhVBdpEvdE20r0gUxMLtb8KUcxT8O4RRb8Xh9vPTbtnWym5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLomcEa3hQohhqGF9IQLKkOJ80D3btfuvhX3I2KuvHpzSC-uDYVcZemS8MX4vfT_5QU5C9RHcyaKoVaHbWyl27C5NMOy6dfG9w&lib=MU7evG46Af933laVWNSEneXXtad7F4Vk4";

const pensionCallendarURL =
    "https://booking.ddnayo.com/booking-calendar-api/calendar/accommodation/12342/reservation-calendar?month=202307&calendarTypeCode=PRICE_CALENDAR&zoneIds=";
