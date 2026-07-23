<template>
	<div :class="$attrs.class" class="flx --flxRow --flx-center --gap-5">
		<BaseWrapper :wrap="!!icon" :disabled="disabled" :class="inputClasses">
			<BaseInput
				v-model="model"
				v-bind="{
					...omit($attrs, 'class'),
					...omit(props, ['modelValue', 'size']),
					type: inputType,
					placeholder,
					disabled,
					...(!icon && { class: inputClasses }),
				}"
			/>
			<IconFa v-bind="iconProps" :name="resolvedIcon" />
		</BaseWrapper>
	</div>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed } from "vue";
	import omit from "lodash-es/omit";
	import debounce from "lodash-es/debounce";

	import type { iFormIconProps, tTextInputType } from "@open-xamu-co/ui-common-types";

	import BaseWrapper from "../base/Wrapper.vue";
	import BaseInput from "../base/Input.vue";
	import IconFa from "../icon/Fa.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";

	interface iInputTimeProps
		extends iInputProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {
		type?: tTextInputType;
		placeholder?: string;
		icon?: IconName;
		iconProps?: iFormIconProps;
		/**
		 * @private
		 */
		modelValue?: number | string;
	}

	/**
	 * Date, Datetime and Time Input element
	 *
	 * @component
	 * @example
	 * <InputTime :value=""></InputTime>
	 */

	defineOptions({ name: "InputTime", inheritAttrs: false });

	const props = defineProps<iInputTimeProps>();
	const emit = defineEmits<{ (e: "update:model-value", value: string | number): void }>();

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props);

	const inputType = computed(() => props.type ?? "date");
	const isTime = computed(() => inputType.value === "time");

	const model = computed({
		get: () => props.modelValue,
		set: debounce((value) => emit("update:model-value", value), 300),
	});

	const inputClasses = computed(() => {
		const targetClass = isTime.value ? "iTime" : "iDate";

		return [modifiersClasses.value, stateClasses.value, themeClasses.value, targetClass];
	});

	const resolvedIcon = computed<IconName>(() => {
		return props.icon ?? (isTime.value ? "clock" : "calendar-days");
	});
</script>
