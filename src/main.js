import Vue from "vue";
import Axios from "axios";
import aframe from "aframe";
import troika from "aframe-troika-text";
import { brand } from "./helpers/brand.js";
import App from "./App.vue";

Vue.prototype.$http = Axios;
Vue.use(aframe);
Vue.use(troika);

Vue.prototype.$brand = brand;

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/^a-/];

new Vue({
  render: (h) => h(App)
}).$mount("#app");
