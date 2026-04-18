<template>
	<template v-if="isButton">
		<ActionButtonToggle v-if="asToggle" v-bind="{ ...$attrs, ...props }">
			<slot v-bind="{ isButton }"></slot>
		</ActionButtonToggle>
		<ActionButton v-else v-bind="{ ...$attrs, ...props }">
			<slot v-bind="{ isButton }"></slot>
		</ActionButton>
	</template>
	<ActionLink v-else v-bind="{ ...$attrs, ...props }">
		<slot v-bind="{ isButton }"></slot>
	</ActionLink>
</template>

<script setup lang="ts">
	import { computed } from "vue";

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
		extends
			iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		/**
		 * Use ActionButtonToggle instead of ActionButton
		 */
		asToggle?: boolean;
		/**
		 * Reverse behavior
		 */
		linkButton?: boolean;
		/**
		 * Breakpoint to switch between button and link
		 */
		breakpoint?: "mobile" | "tablet" | "laptop";
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

	const props = withDefaults(defineProps<iActionButtonLinkProps>(), {
		breakpoint: "tablet",
	});

	const { mobileMqRange, tabletMqRange, laptopMqRange } = useBrowser();

	const isButton = computed<boolean>(() => {
		let breakpointMqRange: boolean;

		switch (props.breakpoint) {
			case "mobile":
				breakpointMqRange = mobileMqRange.value;
				break;
			case "tablet":
				breakpointMqRange = tabletMqRange.value;
				break;
			case "laptop":
				breakpointMqRange = laptopMqRange.value;
				break;
		}

		if (props.linkButton) return !breakpointMqRange;

		return breakpointMqRange;
	});
</script>
