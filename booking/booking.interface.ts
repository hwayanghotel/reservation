import * as Moment from "moment";

export interface CustomerInfo extends DateAndFlatTable, ExtraInfo, NumberOfGuests, Foods, FlatTables {
    customerMemo: string;
    id: string;
    status: "ready" | "paymentReady" | "bookingComplete" | "cancel";
}

export interface ExtraInfo {
    name: string;
    tel: string;
    carNumbers: string[];
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
