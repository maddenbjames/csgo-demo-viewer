import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import VueKonva from 'vue-konva';

const app = createApp(App)
    .use(VueKonva)

    app.mount("#app")
