<template>
  <div>
    <b-modal id="task-modal" title="Editing Task" @ok="updateTask" ok-only>
      <b-input-group prepend="Name" id="thing" class="mb-1">
        <b-form-input class="" v-model="task.name" />
      </b-input-group>
      <b-input-group prepend="Due" class="mb-1">
        <b-form-datepicker
          v-model="task.dueDate"
          value-as-date
          reset-button
          :min="dateUtils.currentDate"
        />
      </b-input-group>
      <b-input-group prepend="Description" class="mb-1">
        <b-form-input v-model="task.description" />
      </b-input-group>
      <b-input-group prepend="Type" class="btn-group-toggle mb-1">
        <b-form-radio-group
          class="flex-grow-1"
          v-model="task.type"
          :options="[
            { text: 'Simple', value: 'simple' },
            { text: 'Ongoing', value: 'ongoing' },
            { text: 'Unscheduled', value: 'unscheduled' },
          ]"
          buttons
        />
      </b-input-group>
      <b-calendar
        block
        hide-header
        class="border p-2 rounded"
        :date-info-fn="dateClass"
        @selected="updateScheduled"
        :min="dateUtils.currentDate"
        :max="task.dueDate"
      />
    </b-modal>
  </div>
</template>
<script lang="ts">
import Vue_ from "@/util/VueUtils";
import Task from "@/util/task/Task";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class TaskModal extends Vue_ {
  @Prop() task!: Task;

  @Watch("task.type")
  onTaskTypeChange() {
    if (this.task.type === "unscheduled") {
      this.task.scheduled = [];
    }
    if (this.task.type === "simple" && this.task.scheduled.length > 1) {
      this.task.scheduled = [this.task.scheduled[0]];
    }
    this.updateTask();
  }

  updateTask() {
    this.taskManager.updateTask(this.task);
    this.$emit("update");
  }

  dateClass(ymd: string, date: Date) {
    return this.task.scheduledDates.some(
      (dateOption) => dateOption.getTime() === date.getTime()
    )
      ? "render-child-active"
      : "";
  }

  updateScheduled(ymd: string, date: Date) {
    if (this.task.type === "ongoing") {
      const alreadyScheduled = this.task.scheduledDates.some(
        (dateOption) => dateOption.getTime() === date.getTime()
      );
      if (alreadyScheduled) {
        this.task.scheduled = this.task.scheduled.filter(
          (dateOption) => dateOption[0].getTime() !== date.getTime()
        );
      } else {
        this.task.scheduled.push([date, false]);
      }
    } else {
      if (this.task.type === "unscheduled") {
        this.task.type = "simple";
      }
      this.task.scheduled = [[date, false]];
    }

    this.updateTask();
  }
}
</script>
<style lang="scss">
.btn-group-toggle > .btn-group > .btn input[type="checkbox"],
.btn-group-toggle > .btn-group > .btn input[type="radio"],
.btn-group-toggle > .btn input[type="checkbox"],
.btn-group-toggle > .btn input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}

.b-calendar header {
  display: none;
}

.b-calendar span.active {
  color: var(--bs-dark) !important;
  background-color: inherit !important;
  border-color: var(--bs-white) !important;
}

.b-calendar div.render-child-active > span {
  color: var(--bs-light) !important;
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
}

.input-group-prepend > div {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.btn-group-toggle > label.btn:first-child {
  border-radius: 0 !important;
}
</style>
