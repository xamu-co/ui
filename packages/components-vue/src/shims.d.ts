/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent;
	export default component;
}

declare module "@simple-m-editor/vue/dist/simple-m-editor.mjs" {
	export { MEditor, marked } from "@simple-m-editor/vue/dist/simple-m-editor.mjs";

	// export type { MEditor, marked } from "@simple-m-editor/vue/dist/index.d.ts";
}
