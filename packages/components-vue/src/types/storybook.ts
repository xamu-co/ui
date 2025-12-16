import type { Meta } from "@storybook/vue3-vite";
import type { ComponentExposed } from "vue-component-type-helpers";

/**
 * Meta for generic vue components
 *
 * @see https://github.com/storybookjs/storybook/issues/24238#issuecomment-2609580391
 */
export type GenericMeta<C> = Omit<Meta<C>, "component"> & {
	component: ComponentExposed<C>;
};
