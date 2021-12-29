import { createApp } from 'vue';
import App from './App.vue';
import * as echarts from 'echarts';
import axios from 'axios';
import router from './router';
import {chalk} from './assets/ts/theme/chalk';
echarts.registerTheme('chalk', chalk)
const app =  createApp(App)

app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$axios = axios
app.use(router)
app.mount('#app')
