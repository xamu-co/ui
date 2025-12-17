<template>
	<div :class="{ '--width-100': fullWidth }">
		<BaseInput
			v-slot="{ id, modelValue }"
			:class="[modifiersClasses, stateClasses, themeClasses, `i${capitalize(inputType)}`]"
			class="--full"
			v-bind="{
				...$attrs,
				...omit(props, ['modelValue', 'size']),
				type: inputType,
				disabled,
				title: label,
			}"
		>
			<!-- Do not hide, since this is used by a pseudo element -->
			<label
				:for="id"
				class="flx --flxRow --flx-start-center --gap-none"
				v-bind="tooltipAttributes"
			>
				<div
					v-if="label || showPlaceholder || $slots.default"
					class="flx --flxColumn --flx-start --flx --gap-none"
				>
					<span v-if="label">{{ label }}</span>
					<span v-else-if="showPlaceholder">
						{{ modelValue ? t("yes") : t("no") }}
					</span>
					<slot></slot>
				</div>
			</label>
		</BaseInput>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import capitalize from "lodash-es/capitalize";
	import omit from "lodash-es/omit";

	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseInput from "../base/Input.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
		iUseThemeTooltipProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	interface iInputToggleProps
		extends
			iInputProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		type?: "checkbox" | "radio" | "switch";
		label?: string;
		showPlaceholder?: boolean;
		fullWidth?: boolean;
	}

	/**
	 * Toggle Input element
	 *
	 * @component
	 */

	defineOptions({ name: "InputToggle", inheritAttrs: false });

	const props = defineProps<iInputToggleProps>();

	const { t } = useHelpers(useI18n);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, tooltipAttributes } = useTheme(props);

	const inputType = computed(() => props.type || "checkbox");
</script>
