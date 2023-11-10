import { Injectable } from "@angular/core";
import { BOOKING_COLLECTION, IBookingService } from "./booking.interface";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { CustomerInfo } from "reservation/booking/booking.interface";
import { CalendarService } from "../calendar/calendar.service";
import * as Moment from "moment";

@Injectable({
    providedIn: "root",
})
export class BookingService implements IBookingService {
    constructor(private store: AngularFirestore, private calendarService: CalendarService) {}

    search(id: string, name: string): Promise<CustomerInfo> {
        console.log("search", id, name);
        return this.store
            .collection(BOOKING_COLLECTION)
            .ref.where("id", "==", id)
            .where("name", "==", name)
            .get()
            .then((snapshot) => {
                let data: any;
                snapshot.forEach((doc) => {
                    data = doc.data();
                    data.date = Moment(data.date.toDate());
                    return data;
                });
                if (data) {
                    return data;
                }
                throw new Error("검색 결과 없음:" + id);
            })
            .catch((e) => {
                throw new Error("검색 과정에서 서버 오류 발생 :" + id + ", " + e);
            });
    }

    add(bookingInfo: CustomerInfo): Promise<CustomerInfo> {
        console.log("add", bookingInfo);
        return this.store
            .collection(BOOKING_COLLECTION)
            .doc(bookingInfo.id)
            .set({ ...bookingInfo, date: bookingInfo.date.toDate() })
            .then(() => this.calendarService.update(bookingInfo).then(() => bookingInfo))
            .catch((e) => {
                throw new Error("add error", e);
            });
    }

    cancel(bookingInfo: CustomerInfo): Promise<CustomerInfo> {
        console.log("cancel", bookingInfo);
        return this.store
            .collection(BOOKING_COLLECTION)
            .doc(bookingInfo.id)
            .update({ ...bookingInfo, status: "cancel", date: bookingInfo.date.toDate() })
            .then(() =>
                this.calendarService
                    .update({ ...bookingInfo, status: "cancel" }, bookingInfo)
                    .then(() => ({ ...bookingInfo, status: "cancel" } as CustomerInfo))
            )
            .catch((e) => {
                throw new Error("cancel error, id:" + bookingInfo.id + ", " + e);
            });
    }

    //Only Manager Use
    update(bookingInfo: CustomerInfo): Promise<CustomerInfo> {
        const asIs = bookingInfo; //이걸 원래 제대로 값을 받아서 해야 하는데..
        //매니저 서비스가 따로 필요하고, 업데이트 api는 거기에 구현하면 될 듯. 아래 delete랑 같이.
        return this.store
            .collection(BOOKING_COLLECTION)
            .doc(bookingInfo.id)
            .update({ ...bookingInfo, date: bookingInfo.date.toDate() })
            .then(() => this.calendarService.update(bookingInfo, asIs).then(() => bookingInfo))
            .catch((e) => {
                throw new Error("update error, id:" + bookingInfo.id + ", " + e);
            });
    }

    //Only Manager Use
    delete(id: string): Promise<string> {
        return this.store
            .collection(BOOKING_COLLECTION)
            .doc(id)
            .delete()
            .then(() => {
                //Update Calender (기존에 이미 Cancel 상태면 안해도 된다.)
                return id;
            })
            .catch((e) => {
                throw new Error("삭제 과정에서 서버 오류 발생 :" + id + ", " + e);
            });
    }
}
