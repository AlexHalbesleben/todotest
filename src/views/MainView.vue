<template>
  <div class="main d-flex overflow-hidden min-vh-100 flex-column max-vw-100">
    <div class="container-fluid d-flex overflow-auto flex-fill p-0">
      <div class="row flex-fill mx-0">
        <DailyView
          ref="dailyView"
          @launchModal="launchModal"
          @update="update"
          class="col-lg-6 flex-grow-1"
        />
        <div class="flex-column d-flex p-0 col-lg-6">
          <div class="row flex-fill mx-0">
            <div class="col overflow-auto flex-shrink-1 position-relative px-0">
              <div class="position-absolute">
                <ListView
                  class="row flex-fill mx-0"
                  @launchModal="launchModal"
                  @update="update"
                  ref="listView"
                />
              </div>
            </div>
          </div>
          <CalendarView ref="calendarView" class="row mx-0 flex-grow-0" />
        </div>
      </div>
    </div>
    <TaskModal :task="editedTask" @update="update" />
  </div>
</template>

<script lang="ts">
import TaskModal from "@/components/TaskModal.vue";
import Vue_ from "@/util/VueUtils";
import Task from "@/util/task/Task";
import { Component } from "vue-property-decorator";
import CalendarView from "./CalendarView.vue";
import DailyView from "./DailyView.vue";
import ListView from "./ListView.vue";

@Component({
  components: {
    CalendarView,
    DailyView,
    ListView,
    TaskModal,
  },
})
export default class MainView extends Vue_ {
  $refs!: {
    calendarView: CalendarView;
    dailyView: DailyView;
    listView: ListView;
  };

  editedTask = new Task();
  $bvModal: any;

  launchModal(task: Task) {
    this.editedTask = task;
    this.$bvModal.show("task-modal");
  }

  update() {
    if (!this.$refs.calendarView) return;
    this.$refs.calendarView.refreshKey++;
    this.$refs.dailyView.refreshKey++;
    this.$refs.listView.refreshKey++;
  }
}
</script>
