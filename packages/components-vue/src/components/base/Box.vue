<template>
	<component
		:is="el || 'div'"
		class="box"
		:class="[
			modifiersClasses,
			stateClasses,
			themeClasses,
			GMC(button ?? false, { modifier: 'button' }),
			{ ' --opaque': opaque },
			{ ' --square': square },
			{ ' --bdr-dashed': dashed },
			{ ' --bdr-solid': solid && !dashed },
			{ '--bgColor-none': transparent },
			colorClasses,
		]"
		v-bind="$attrs"
	>
		<slot></slot>
	</component>
</template>
<script setup lang="ts">
	import { computed } from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import type { vComponent } from "../../types/plugin";
	import type { iUseModifiersProps, iUseStateProps, iUseThemeProps } from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	interface iBaseBoxProps extends iUseModifiersProps, iUseStateProps, iUseThemeProps {
		/**
		 * Component or tag to render
		 */
		el?: vComponent | string;
		/**
		 * less padding
		 */
		button?: boolean;
		dashed?: boolean;
		solid?: boolean;
		transparent?: boolean;
		withColor?: boolean;
		/** Prefer an opaque background */
		opaque?: boolean;
		/**
		 * Square shape
		 */
		square?: boolean;
	}

	/**
	 * Basic box
	 *
	 * @component
	 * @example
	 * <BaseBox></BaseBox>
	 */

	defineOptions({ name: "BaseBox", inheritAttrs: false });

	const props = defineProps<iBaseBoxProps>();

	const { getModifierClasses: GMC } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, themeValues } = useTheme(props);

	const colorClasses = computed(() => {
		const [theme, themeWithColor] = themeValues.value;
		const classes = GMC([props.opaque ? themeWithColor : theme], {
			modifier: "txtColor",
			divider: "-",
		});

		return props.withColor ? classes : [];
	});
</script>
