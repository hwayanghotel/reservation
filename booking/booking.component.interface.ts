import * as Moment from "moment";

export interface CustomerInfo extends DateAndFlatTable, UserInfo, NumberOfGuests, Foods, FlatTables {
    customerMemo: string;
    id: string;
    status: "ready" | "paymentReady" | "confirming" | "bookingComplete" | "cancel";
    cars: string[];
    deposit?: number;
}

export interface UserInfo {
    name: string;
    tel: string;
}

export interface NumberOfGuests {
    person: number;
    kids: number;
}

export interface Foods {
    neungiBaeksuk: number;
    baeksuk: number;
    mushroomStew: number;
    mushroomStewForTwoPeople: number;
}

export interface DateAndFlatTable extends FlatTables {
    date: Moment.Moment;
}

export interface FlatTables {
    flatTable: number;
    dechTable: number;
}
