<template>
	<datalist :id="selectFilterName">
		<!-- Select is also used as fallback for older browsers -->
		<SelectSimple
			v-model="model"
			v-bind="{
				...$attrs,
				..._.omit(props, 'modelValue'),
				options: selectOptions.map(({ value, alias }) => ({
					alias,
					value: alias ?? value,
				})),
				placeholder: placeholder ?? t('select_placeholder'),
				disabled,
				hidden,
				size,
				active,
				invalid,
				state,
				theme,
			}"
		/>
	</datalist>
	<div v-if="supportsDatalist" class="flx --flxRow --flx-start-center --gap-5" v-bind="$attrs">
		<InputText
			v-model="textModel"
			:list="selectFilterName"
			v-bind="{
				..._.omit(props, 'modelValue'),
				type: 'text',
				placeholder: t('select_filter_options'),
				disabled: (!!model && !isInvalid) || disabled,
				hidden,
				size,
				active,
				invalid: isInvalid,
				state,
				theme,
				icon,
				iconProps,
			}"
			class="--flx"
			@change="handleInputChange"
		/>
		<ActionLink
			v-if="model && selectOptions.length > 1"
			:theme="theme"
			:aria-label="t('select_restablish_field')"
			:title="t('select_restablish_field')"
			@click.prevent="model = ''"
		>
			<IconFa name="xmark" size="20" />
		</ActionLink>
	</div>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed, ref } from "vue";
	import _ from "lodash";

	import type { iFormIconProps, iFormOption } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n, useUtils } from "@open-xamu-co/ui-common-helpers";

	import SelectSimple from "./Simple.vue";
	import InputText from "../input/Text.vue";
	import ActionLink from "../action/Link.vue";
	import IconFa from "../icon/Fa.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iSelectProps,
	} from "../../types/props";
	import useUUID from "../../composables/uuid";
	import useHelpers from "../../composables/helpers";

	interface iSelectFilterProps
		extends iSelectProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
		icon?: IconName;
		iconProps?: iFormIconProps;
		/**
		 * Vue model value
		 * @private
		 */
		modelValue?: string | number;
	}

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	defineOptions({ name: "SelectFilter", inheritAttrs: false });

	const props = defineProps<iSelectFilterProps>();
	const emit = defineEmits(["update:model-value"]);

	const { t } = useHelpers(useI18n);
	const { isBrowser } = useHelpers(useUtils);
	const { uuid } = useUUID();

	const randomId = uuid().replace("-", "").substring(0, 8);
	const supportsDatalist = ref(true);
	/** Prefer a predictable identifier */
	const selectFilterName = computed(() => {
		const seed = _.deburr(props.id || props.name || props.placeholder || props.title);

		return `select-filter_${seed.replace(" ", "") || randomId}`;
	});
	const selectOptions = computed<iFormOption[]>(() => {
		return (props.options ?? []).map(toOption);
	});
	const textModel = ref<string | number>(props.modelValue || "");
	/**
	 * Input model
	 */
	const model = computed({
		get: () => props.modelValue,
		set: (newModel = "") => {
			const deburr = (string: string) => _.deburr(string).toLowerCase();

			// look for alias first
			const option = selectOptions.value.find(({ value, alias }) => {
				const match = alias ?? value;

				if (typeof newModel === "string" && typeof match === "string") {
					if (deburr(match) === deburr(newModel)) return true;
				}

				return match === newModel;
			});

			if (option) {
				textModel.value = option.alias || option.value;
				emit("update:model-value", option.value);
			} else if (newModel === "") {
				textModel.value = newModel;
				emit("update:model-value", newModel);
			}
		},
	});
	const isInvalid = computed<boolean>(() => {
		const option = selectOptions.value.find(({ value }) => value === model.value);

		return (model.value && !option) || props.invalid;
	});

	/**
	 * Handle select input
	 * @listenerOverride select filter requires specific event handling
	 */
	function handleInputChange(e: Event) {
		const { target } = e as Event & { target: HTMLSelectElement };

		model.value = target.value;
	}

	if (isBrowser) supportsDatalist.value = !!HTMLDataListElement;
</script>
