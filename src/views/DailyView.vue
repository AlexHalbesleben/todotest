<template>
  <div class="border p-2 d-flex flex-column">
    <div class="flex-grow-1">
      <div class="h3">Today's Tasks</div>
      <ul class="list-group container-fluid px-0">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="list-group-item row mx-0 d-flex p-0 align-items-center overflow-hidden"
        >
          <div class="col-sm row px-0 mx-0 align-items-center">
            <div class="col">{{ task.name }}</div>
            <div class="col-auto" v-if="task.dueDate">
              Due
              {{ dateUtils.month(task.dueDate) + 1 }}/{{
                dateUtils.day(task.dueDate)
              }}{{
                dateUtils.current.year != dateUtils.year(task.dueDate)
                  ? `/${dateUtils.year(task.dueDate).toString().slice(-2)}`
                  : ""
              }}
            </div>
          </div>
          <div class="col-sm-auto row px-0 mx-0 h-100">
            <button
              class="btn btn-secondary rounded-0 col h-100"
              @click="unschedule(task)"
            >
              Not today
            </button>
            <div class="col-auto p-0">
              <button
                class="btn btn-primary rounded-0 h-100"
                @click="launchModal(task)"
              >
                Edit
              </button>
            </div>
            <div class="col-auto p-0">
              <button
                class="btn btn-danger rounded-0 h-100"
                @click="deleteTask(task)"
              >
                X
              </button>
            </div>
            <div class="col-auto p-0">
              <button
                class="btn btn-success rounded-0 h-100"
                @click="completeTask(task)"
              >
                Done
              </button>
            </div>
          </div>
        </li>
        <li
          class="list-group-item row mx-0 d-flex p-0 align-items-center no-tasks-list-item"
          v-if="tasks.length === 0"
        >
          <div class="col">No tasks!</div>
        </li>
      </ul>
    </div>
    <div class="">
      <div class="h3">Completed</div>
      <ul class="list-group container-fluid px-0">
        <li
          v-for="task in completedTasks"
          :key="task.id"
          class="list-group-item row mx-0 d-flex p-0 align-items-center overflow-hidden"
        >
          <div class="col-sm row px-0 mx-0 align-items-center">
            <div class="col">{{ task.name }}</div>
            <div class="col-auto" v-if="task.dueDate">
              Due
              {{ dateUtils.month(task.dueDate) + 1 }}/{{
                dateUtils.day(task.dueDate)
              }}{{
                dateUtils.current.year != dateUtils.year(task.dueDate)
                  ? `/${dateUtils.year(task.dueDate).toString().slice(-2)}`
                  : ""
              }}
            </div>
          </div>
          <div class="col-sm-auto row px-0 mx-0">
            <div class="col-auto p-0">
              <button
                class="btn btn-success rounded-0 h-100"
                @click="uncompleteTask(task)"
              >
                Uncomplete
              </button>
            </div>
          </div>
        </li>
        <li
          class="list-group-item row mx-0 d-flex p-0 align-items-center no-tasks-list-item"
          v-if="completedTasks.length === 0"
        >
          <div class="col">No tasks!</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import TaskModal from "@/components/TaskModal.vue";
import Vue_ from "@/util/VueUtils";
import Task from "@/util/task/Task";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    TaskModal,
  },
})
export default class DailyView extends Vue_ {
  refreshKey = 0;

  get tasks(): Task[] {
    this.refreshKey;
    return this.taskManager.uncompletedTasksOnDate(this.dateUtils.currentDate);
  }

  get completedTasks(): Task[] {
    this.refreshKey;
    return this.taskManager.completedTasksOnDate(this.dateUtils.currentDate);
  }

  editedTask = new Task();

  deleteTask(task: Task) {
    this.taskManager.deleteTask(task);
    this.$emit("update");
  }

  launchModal(task: Task) {
    this.$emit("launchModal", task);
  }

  unschedule(task: Task) {
    if (task.type === "ongoing") {
      task.scheduled = task.scheduled.filter((date) => {
        return date[0].getTime() !== this.dateUtils.currentDate.getTime();
      });
    } else {
      task.type = "unscheduled";
      task.scheduled = [];
    }
    this.taskManager.updateTask(task);
    this.$emit("update");
  }

  completeTask(task: Task) {
    let updatedIndex = task.scheduled.findIndex((date) => {
      return date[0].getTime() === this.dateUtils.currentDate.getTime();
    });
    if (updatedIndex !== -1) {
      task.scheduled[updatedIndex][1] = true;
      this.taskManager.updateTask(task);
      this.$emit("update");
    }
  }

  uncompleteTask(task: Task) {
    this.taskManager.uncompleteTask(task, this.dateUtils.currentDate);
    this.$emit("update");
  }
}
</script>
<style lang="scss" scoped>
.no-tasks-list-item {
  height: 38.6667px;
}
</style>
