import { App, h, ref, Plugin } from "vue";
import ABTests from "./ABTests.vue";
import ABTest from "./ABTest.vue";

const myPlugin: Plugin = {
  install(app: App, options: any) {
    app.component('ab-tests', ABTests);
    app.component('ab-test', ABTest);
  }
}

export default myPlugin;