import { DuplicateIDError, TaskNotFoundError } from "../Errors";
import StorageManager from "../storage/StorageManager";
import Task from "./Task";

export default class TaskManager {
  static instance: TaskManager = new TaskManager();

  get storageManager(): StorageManager {
    return StorageManager.instance;
  }

  updateStorage() {
    this.storageManager.tasks = this.tasks;
    this.storageManager.completed = this.completed;
  }

  tasks = this.storageManager.tasks;
  completed = this.storageManager.completed;

  createTask(task: Task) {
    if (this.tasks.map((task) => task.id).includes(task.id)) {
      throw new DuplicateIDError("Task ID already exists");
    }
    this.tasks = [...this.tasks, task];

    this.updateStorage();
  }

  updateTask(task: Task) {
    const updatedIndex = this.tasks.findIndex((t) => t.id === task.id);
    if (updatedIndex === -1) {
      throw new TaskNotFoundError("Cannot update task that does not exist");
    }

    this.tasks[updatedIndex] = task;

    if (task.completed) {
      this.completed = [...this.completed, task];
      this.deleteTask(task);
    }

    this.updateStorage();
  }

  deleteTask(task: Task) {
    const updatedIndex = this.tasks.findIndex((t) => t.id === task.id);
    if (updatedIndex === -1) {
      throw new TaskNotFoundError("Cannot delete task that does not exist");
    }

    this.tasks.splice(updatedIndex, 1);
    this.updateStorage();
  }

  uncompleteTask(task: Task, date: Date) {
    const scheduledIndex = task.scheduled.findIndex(
      (scheduled) => scheduled[0].getTime() === date.getTime()
    );
    if (scheduledIndex !== -1) {
      task.scheduled[scheduledIndex][1] = false;
    }

    if (task.completed) {
      const completedIndex = this.completed.findIndex((t) => t.id === task.id);
      if (completedIndex === -1) {
        throw new TaskNotFoundError(
          "Cannot uncomplete task that does not exist"
        );
      }

      this.completed.splice(completedIndex, 1);

      this.createTask(task);
    } else {
      this.updateTask(task);
    }
  }

  tasksOnDate(date: Date) {
    return this.tasks.filter((task) =>
      task.scheduledDates.some(
        (scheduledDate) =>
          scheduledDate.getFullYear() === date.getFullYear() &&
          scheduledDate.getMonth() === date.getMonth() &&
          scheduledDate.getDate() === date.getDate()
      )
    );
  }

  uncompletedTasksOnDate(date: Date) {
    return this.tasksOnDate(date).filter((task) => {
      const scheduledOnDay = task.scheduled.findIndex(
        (item) => item[0].getTime() === date.getTime()
      );
      return scheduledOnDay !== -1 && !task.scheduled[scheduledOnDay][1];
    });
  }

  completedTasksOnDate(date: Date) {
    const incomplete = this.tasks.filter(
      (task) =>
        task.type === "ongoing" &&
        task.scheduled.some(
          (scheduled) =>
            scheduled[1] && scheduled[0].getTime() === date.getTime()
        )
    );

    const completed = this.completed.filter((task) =>
      task.scheduled.some(
        (scheduled) => scheduled[1] && scheduled[0].getTime() === date.getTime()
      )
    );

    return [...incomplete, ...completed];
  }
}
