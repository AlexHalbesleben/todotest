export default class DateUtils {
  static instance: DateUtils = new DateUtils();

  stripTime(of: Date): Date {
    return new Date(of.getFullYear(), of.getMonth(), of.getDate());
  }

  /**
   * @param a earlier date
   * @param b later date
   * @returns the number of days between the two dates
   */
  daysBetween(a: Date, b: Date): number {
    return Math.floor(
      (this.stripTime(b).getTime() - this.stripTime(a).getTime()) / 86400000
    );
  }

  year(a: Date): number {
    return a.getFullYear();
  }

  month(a: Date): number {
    return a.getMonth();
  }

  day(a: Date): number {
    return a.getDate();
  }

  get currentDate(): Date {
    return this.stripTime(new Date());
  }

  get current(): { day: number; month: number; year: number } {
    const now = this.currentDate;
    return {
      day: this.day(now),
      month: this.month(now),
      year: this.year(now),
    };
  }

  formDate({
    day = this.current.day,
    month = this.current.month,
    year = this.current.year,
  } = {}) {
    return new Date(year, month, day);
  }
}
