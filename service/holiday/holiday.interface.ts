import * as Moment from "moment";

export interface IHolidayService {
    getHolidays(date: Moment.Moment): Promise<number[]>;
}
