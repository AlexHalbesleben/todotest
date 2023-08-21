<template>
  <div class="p-2 mx-0 pt-0">
    <div class="sticky-top px-0 bg-white">
      <div class="h3 mt-2">Tasks</div>
      <li
        class="list-group-item input-group d-flex p-0 border-0 top-item sticky-top"
      >
        <input
          type="text"
          class="form-control"
          v-model="editedTask.name"
          @keypress.enter="createTask"
        />
        <b-form-datepicker
          v-model="editedTask.dueDate"
          value-as-date
          reset-button
          :min="dateUtils.currentDate"
          right
        />
        <button class="btn btn-success input-group-append" @click="createTask">
          +
        </button>
      </li>
    </div>
    <ul class="list-group container-fluid px-0 overflow-auto">
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
            class="col btn btn-secondary rounded-0 h-100"
            @click="scheduleToday(task)"
            :disabled="
              task.scheduledDates.some(
                (date) => date.getTime() === dateUtils.currentDate.getTime()
              )
            "
          >
            Schedule Today
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
        </div>
      </li>
      <li
        class="list-group-item no-tasks-list-item row mx-0 d-flex p-0 align-items-center"
        v-if="tasks.length === 0"
      >
        <div class="col">No tasks!</div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import TaskModal from "@/components/TaskModal.vue";
import Task from "@/util/task/Task";
import Vue_ from "@/util/VueUtils";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    TaskModal,
  },
})
export default class ListView extends Vue_ {
  refreshKey = 0;
  get tasks(): Task[] {
    this.refreshKey;
    return this.taskManager.tasks;
  }

  editedTask = new Task();

  createTask() {
    this.taskManager.createTask(this.editedTask);
    this.editedTask = new Task();
    this.$emit("update");
  }

  deleteTask(task: Task) {
    this.taskManager.deleteTask(task);
    this.$emit("update");
  }

  launchModal(task: Task) {
    this.$emit("launchModal", task);
  }

  scheduleToday(task: Task) {
    if (task.type === "ongoing") {
      task.scheduled.push([this.dateUtils.currentDate, false]);
    } else {
      if (task.type === "unscheduled") {
        task.type = "simple";
      }
      task.scheduled = [[this.dateUtils.currentDate, false]];
    }
    this.taskManager.updateTask(task);
    this.$emit("update");
  }
}
</script>
<style lang="scss" scoped>
.top-item > * {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

li.list-group-item.bottom-item {
  overflow: visible !important;
}

.btn-group-toggle > .btn-group > .btn input[type="checkbox"],
.btn-group-toggle > .btn-group > .btn input[type="radio"],
.btn-group-toggle > .btn input[type="checkbox"],
.btn-group-toggle > .btn input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}

.no-tasks-list-item {
  height: 38.6667px;
}

.list-group {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
}
</style>
