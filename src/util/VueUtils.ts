import { Vue } from "vue-property-decorator";
import DateUtils from "./DateUtils";
import NotificationManager from "./NotificationManager";
import StorageManager from "./storage/StorageManager";
import TaskManager from "./task/TaskManager";

export default class Vue_ extends Vue {
  get taskManager(): TaskManager {
    return TaskManager.instance;
  }

  get storageManager(): StorageManager {
    return StorageManager.instance;
  }

  get notificationManager(): NotificationManager {
    return NotificationManager.instance;
  }

  get dateUtils(): DateUtils {
    return DateUtils.instance;
  }
}
