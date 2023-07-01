import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";

export interface IDBService {
    id?: string;
    예약유형: "식사" | "평상" | "객실";
    날짜: string;
    시간?: number;
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
    예약시점: string;
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
        this.firebaseStore$ = this.store.collection(COLLECTION).valueChanges({ idField: "id" }) as Observable<any[]>;
        // this.firebaseStore$ = this.http.get("assets/fire.json") as Observable<any[]>;
    }

    async getDailyData(type: "식사" | "평상" | "객실", date: string): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.firebaseStore$.subscribe((db) => {
                resolve(db.filter((v) => v["예약유형"] === type && v["날짜"] === date));
            });
        });
    }

    add(model: IDBService) {
        this.store.collection(COLLECTION).add(model);
    }

    edit(model: IDBService) {
        this.store.collection(COLLECTION).doc(model.id).update(model);
    }

    delete(id: string) {
        this.store.collection(COLLECTION).doc(id).delete();
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
