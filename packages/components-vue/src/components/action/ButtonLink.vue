<template>
	<template v-if="tabletMqRange">
		<ActionButtonToggle v-if="asToggle" v-bind="{ ...$attrs, ...props }">
			<slot></slot>
		</ActionButtonToggle>
		<ActionButton v-else v-bind="{ ...$attrs, ...props }">
			<slot></slot>
		</ActionButton>
	</template>
	<ActionLink v-else v-bind="{ ...$attrs, ...props }"><slot></slot></ActionLink>
</template>

<script setup lang="ts">
	import ActionButton from "./Button.vue";
	import ActionButtonToggle from "./ButtonToggle.vue";
	import ActionLink from "./Link.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
		iUseThemeTooltipProps,
	} from "../../types/props";
	import useBrowser from "../../composables/browser";

	interface iActionButtonLinkProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		/**
		 * Use ActionButtonToggle instead of ActionButton
		 */
		asToggle?: boolean;
	}

	/**
	 * Action Button Link Component
	 * Switch between bttn & link
	 *
	 * @component
	 * @example
	 * <ActionButtonLink></ActionButtonLink>
	 */

	defineOptions({ name: "ActionButtonLink", inheritAttrs: false });

	const props = defineProps<iActionButtonLinkProps>();

	const { tabletMqRange } = useBrowser();
</script>
