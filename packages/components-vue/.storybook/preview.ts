import { h } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { type Preview, setup } from "@storybook/vue3-vite";

import locale from "@open-xamu-co/ui-common-helpers/en";
import "@open-xamu-co/ui-styles/src/index.scss";

import { XamuPlugin } from "../src/plugin";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: h(() => "404"),
		},
	],
});

setup((app) => {
	app.use(router);
	app.use(XamuPlugin, {
		locale: locale,
		lang: "es",
		country: "co",
		imageHosts: ["picsum.photos"],
	});
});

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	tags: ["autodocs"],
};

export default preview;
