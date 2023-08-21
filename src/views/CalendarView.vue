<template>
  <div class="border-top p-2 col">
    <div class="h3">Calendar</div>
    <b-calendar
      :date-info-fn="dateClass"
      block
      class="border p-1 rounded"
    ></b-calendar>
  </div>
</template>
<script lang="ts">
import Vue_ from "@/util/VueUtils";
import { Component } from "vue-property-decorator";

@Component
export default class CalendarView extends Vue_ {
  refreshKey = 0;

  dateClass(ymd: string, date: Date) {
    this.refreshKey;
    return `day-tasks day-tasks-${Math.min(
      3,
      this.taskManager.tasksOnDate(date).length
    )}`;
  }
}
</script>
<style lang="scss">
.day-tasks > span::after {
  margin-left: 4px;
  position: absolute;
  transform: scale(2);
  white-space: pre;
  line-height: calc(1 / 3);

  transition: opacity 0.25s;
}

.day-tasks > span.active::after {
  opacity: 0;
}

.day-tasks-1 > span::after {
  content: "•";
  margin-top: 3px;
}

.day-tasks-2 > span::after {
  content: "•\A•";
  margin-top: 1px;
}

.day-tasks-3 > span::after {
  content: "•\A•\A•";
  margin-top: -1.5px;
}
</style>
