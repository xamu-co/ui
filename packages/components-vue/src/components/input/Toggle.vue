<template>
	<div :class="{ '--width': fullWidth }">
		<BaseInput
			v-slot="{ id, modelValue }"
			:class="[modifiersClasses, stateClasses, themeClasses, `i${_.capitalize(inputType)}`]"
			class="--full"
			v-bind="{
				...$attrs,
				..._.omit(props, ['modelValue', 'size']),
				type: inputType,
				disabled,
			}"
		>
			<!-- Do not hide, since this is used by a pseudo element -->
			<label :for="id" class="flx --flxRow --flx-start-center --gap-none">
				<div
					v-if="label || showPlaceholder || $slots.default"
					class="flx --flxColumn --flx-start --flx --gap-none"
				>
					<span v-if="label">{{ label }}</span>
					<span v-else-if="showPlaceholder">
						{{ t(modelValue ? "yes" : "no") }}
					</span>
					<slot></slot>
				</div>
			</label>
		</BaseInput>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import _ from "lodash";

	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseInput from "../base/Input.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	interface iInputToggleProps
		extends iInputProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
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
	const { themeClasses } = useTheme(props);

	const inputType = computed(() => props.type || "checkbox");
</script>
