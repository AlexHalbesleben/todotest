import Day, { StoredDay } from "../day/Day";
import Task, { StoredTask } from "../task/Task";

export default class StorageManager {
  static instance: StorageManager = new StorageManager();

  get tasks(): Task[] {
    return JSON.parse(localStorage.getItem("tasks") || "[]").map(
      (task: StoredTask) => new Task(task)
    );
  }

  set tasks(tasks: Task[]) {
    const storedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      scheduled: task.scheduled,
      created: task.created,
      type: task.type,
    }));
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  }

  get completed(): Task[] {
    return JSON.parse(localStorage.getItem("completed") || "[]").map(
      (task: StoredTask) => new Task(task)
    );
  }

  set completed(tasks: Task[]) {
    const storedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      scheduled: task.scheduled,
      created: task.created,
      type: task.type,
    }));
    localStorage.setItem("completed", JSON.stringify(storedTasks));
  }

  get nextID(): number {
    const returnValue = parseInt(localStorage.getItem("nextID") || "0");
    localStorage.setItem("nextID", (returnValue + 1).toString());
    return returnValue;
  }

  get days(): Day[] {
    return JSON.parse(localStorage.getItem("days") || "[]").map(
      (day: StoredDay) => new Day(day)
    );
  }

  set days(days: Day[]) {
    const storedDays = days.map((day) => {
      return {
        date: day.date,
        tasks: day.tasks,
      };
    });
    localStorage.setItem("days", JSON.stringify(storedDays));
  }
}
