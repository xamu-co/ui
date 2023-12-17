import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import locale from "@open-xamu-co/ui-common-helpers/es";
import "@open-xamu-co/ui-styles/dist/index.min.css";

import { XamuPlugin } from "../plugin";

import App from "./app.vue";

const router = createRouter({ history: createWebHistory(), routes: [] });
const app = createApp(App);

app.use(router);
app.use(XamuPlugin, { locale: locale, lang: "es", country: "co" });
app.mount("#appex");
