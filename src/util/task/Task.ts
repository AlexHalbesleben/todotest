import StorageManager from "../storage/StorageManager";

export type StoredTask = {
  name: string;
  description: string;
  dueDate: string | null;
  scheduled: (string | [string, boolean])[];
  created: string;
};

export default class Task {
  name: string;
  description: string;
  dueDate: Date | null;
  scheduled: [Date, boolean][];
  created: Date;
  id: number;
  type: "simple" | "ongoing" | "unscheduled";

  constructor({
    name = "",
    description = "",
    dueDate = null as Date | string | null,
    scheduled = [] as ((Date | string) | [Date | string, boolean])[],
    id = StorageManager.instance.nextID,
    created = new Date() as Date | string,
    type = "",
  } = {}) {
    this.name = name;
    this.description = description;
    this.dueDate =
      dueDate instanceof Date
        ? dueDate
        : dueDate !== null
        ? new Date(dueDate as string)
        : dueDate;
    this.created = this.cleanUpDateString(created);
    this.id = id;

    this.scheduled = scheduled.map((item) => {
      if (Array.isArray(item)) {
        return [this.cleanUpDateString(item[0]), item[1]] as [Date, boolean];
      }
      return [this.cleanUpDateString(item), false] as [Date, boolean];
    });

    if (!["simple", "ongoing", "unscheduled"].includes(type)) {
      const tasksScheduled = this.scheduled.length;
      this.type =
        tasksScheduled > 1
          ? "ongoing"
          : tasksScheduled === 1
          ? "simple"
          : "unscheduled";
    } else {
      this.type = type as "simple" | "ongoing" | "unscheduled";
    }
  }

  get scheduledDates(): Date[] {
    return this.scheduled.map((item) => item[0]);
  }

  get completed(): boolean {
    return this.scheduled.every((item) => item[1]) && this.scheduled.length > 0;
  }

  cleanUpDateString(d: string | Date) {
    return typeof d === "string" ? new Date(d) : d;
  }
}
