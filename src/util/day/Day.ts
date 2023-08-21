import DateUtils from "../DateUtils";

export type StoredDay = {
  date: string;
  tasks: number[];
};

export default class Day {
  date: Date;
  tasks: number[];

  constructor({
    date = new Date() as Date | string,
    tasks = [] as number[],
  } = {}) {
    this.date = date instanceof Date ? date : new Date(date);
    this.date = DateUtils.instance.stripTime(
      date instanceof Date ? date : new Date(date)
    );
    this.tasks = tasks;
  }
}
