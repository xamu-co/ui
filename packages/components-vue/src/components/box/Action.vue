<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="getClassesString([modifiersClasses, stateClasses, themeClasses])"
		class="box --button"
	>
		<div :class="getClassesString([innerThemeClasses])" class="box --square-sm">
			<IconFa v-if="!src" v-bind="{ ...iconProps, name: icon ?? 'cubes', size: 50 }" />
			<BaseImg v-else class="--bgColor-light --width --height" :src="src" :alt="text" />
		</div>
		<p>
			<!-- Since we only accept text there is no room for slot here -->
			<b>{{ text }}</b>
		</p>
	</BaseAction>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { iFormIconProps } from "@open-xamu-co/ui-common-types";
	import { useUtils } from "@open-xamu-co/ui-common-helpers";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BaseImg from "../base/Img.vue";
	import IconFa from "../icon/Fa.vue";
	import BaseAction from "../base/Action.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
		iUseThemeTooltipProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

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
		iconProps?: iFormIconProps;
		/**
		 * image url or path
		 */
		src?: string;
		/**
		 * action text
		 * @required
		 */
		text: string;
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

	const { getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, tooltipAttributes } = useTheme(props);
	const { themeClasses: innerThemeClasses } = useTheme({ theme: eColors.LIGHT });
</script>
