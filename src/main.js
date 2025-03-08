import {createApp} from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from "axios";

axios.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    })

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')