import { DayNotFoundError } from "../Errors";
import StorageManager from "../storage/StorageManager";
import Task from "../task/Task";
import Day from "./Day";

export default class DayManager {
  static instance: DayManager = new DayManager();

  get storageManager(): StorageManager {
    return StorageManager.instance;
  }

  updateStorage() {
    this.storageManager.days = this.days;
  }

  days = this.storageManager.days;

  updateDay(day: Day) {
    const updatedIndex = this.days.findIndex((d) => d.date === day.date);
    if (updatedIndex === -1) {
      this.days = [...this.days, day];
      this.updateStorage();
      return;
    }
    this.days[updatedIndex] = day;
    this.updateStorage();
  }

  createDay(day: Day) {
    if (this.days.map((day) => day.date).includes(day.date)) {
      throw new DayNotFoundError("Day already exists");
    }
    this.days = [...this.days, day];
    this.updateStorage();
  }

  findDay(date: Date): Day | null {
    const day = this.days.find((day) => day.date.getTime() == date.getTime());
    if (!day) {
      return null;
    }
    return day;
  }

  tasksForDay(date: Date) {
    return this.findDay(date)?.tasks ?? [];
  }

  removeTaskFromDay(date: Date, task: Task) {
    let day = this.findDay(date);
    if (!day) {
      day = new Day({ date });
      this.createDay(day);
    }

    day.tasks = day.tasks.filter((t) => t !== task.id);
    this.updateDay(day);
  }

  addTaskToDay(date: Date, task: Task) {
    let day = this.findDay(date);
    if (!day) {
      day = new Day({ date });
      this.createDay(day);
    }
    if (!day.tasks.some((t) => t == task.id)) {
      day.tasks = [...day.tasks, task.id];
    }
    this.updateDay(day);
  }
}
