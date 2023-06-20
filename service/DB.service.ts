import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, shareReplay } from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";

export interface IDBService {
    예약유형: "식사" | "평상";
    날짜: string;
    시간?: 12 | 15 | 0;
    성함: string;
    인원: number;
    전화번호: string;
    차량번호: string;
    메모: string;
    평상?: number;
    테이블?: number;
    능이백숙?: number;
    백숙?: number;
    버섯찌개?: number;
    버섯찌개2?: number;
    상태: "대기중" | "취소" | "예약완료";
}

@Injectable({
    providedIn: "root",
})
export class DBService {
    private firebaseStore$: Observable<any[]>;
    constructor(private datePipe: DatePipe, private http: HttpClient, private store: AngularFirestore) {
        // this.firebaseStore$ = this.store.collection("hwayanghotel").valueChanges({ idField: "id" }) as Observable<any[]>;
        this.firebaseStore$ = this.http.get("assets/fire.json") as Observable<any[]>;
    }

    async getDailyData(type: "식사" | "평상", date: string): Promise<IDBService[]> {
        return new Promise((resolve) => {
            this.firebaseStore$.subscribe((db) => {
                resolve(db.filter((v) => v["예약유형"] === type && v["날짜"] === date));
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
//       this.store.collection("hwayanghotel").add(result);
//   }
// });
