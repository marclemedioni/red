import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toast from 'vue-toastification'
//import "vue-toastification/dist/index.css"

const options = {
    position: "bottom-right",
    timeout: 60000,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    closeButton: false,
    rtl: false,
    icon: false
};

const app = createApp(App)
app.use(VueAxios, axios)
app.use(Toast, options)
app.use(router).mount('#app')