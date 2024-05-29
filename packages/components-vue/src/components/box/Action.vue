<template>
	<BaseBox
		:el="BaseAction"
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:aria-label="label"
		button
	>
		<div v-if="icon || src" :class="innerThemeClasses" class="box --square">
			<IconFa v-if="icon" v-bind="{ size: 35, ...iconProps, name: icon }" />
			<BaseImg
				v-else-if="src"
				class="--bgColor-light --width --height"
				:src="src"
				:alt="label"
			/>
		</div>
		<p>
			<!-- Since we only accept label there is no room for slot here -->
			<b>{{ label }}</b>
		</p>
	</BaseBox>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { iFormIconProps } from "@open-xamu-co/ui-common-types";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BaseBox from "../base/Box.vue";
	import BaseImg from "../base/Img.vue";
	import BaseAction from "../base/Action.vue";
	import IconFa from "../icon/Fa.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
		iUseThemeTooltipProps,
	} from "../../types/props";
	import useTheme from "../../composables/theme";

	interface iBoxActionProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		/**
		 * FontAwesome icon
		 */
		icon?: IconName;
		iconProps?: iFormIconProps & { size: number };
		/**
		 * image url or path
		 */
		src?: string;
		/**
		 * action label
		 * @old text - collision with router-link attribute
		 * @required true
		 */
		label: string;
	}

	/**
	 * BoxAction Component
	 *
	 * @component
	 * @example
	 * <BoxAction></BoxAction>
	 */

	defineOptions({ name: "BoxAction", inheritAttrs: false });

	const props = defineProps<iBoxActionProps>();

	const { tooltipAttributes } = useTheme(props);
	const { themeClasses: innerThemeClasses } = useTheme({ theme: eColors.LIGHT });
</script>
