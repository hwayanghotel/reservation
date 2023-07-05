import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/compat/firestore";

export const NY_TEST_COLLECTION = "NY_TEST";

export class Uploader {
    constructor(private http: HttpClient, private store: AngularFirestore) {}

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
}
