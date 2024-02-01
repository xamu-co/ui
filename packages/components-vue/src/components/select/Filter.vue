<template>
	<datalist :id="selectFilterName">
		<!-- Select is also used as fallback for older browsers -->
		<SelectSimple
			v-model="aliasModel"
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
			v-model="aliasModel"
			:list="selectFilterName"
			v-bind="{
				..._.omit(props, 'modelValue'),
				type: 'text',
				placeholder: t('select_filter_options'),
				disabled: (!!modelValue && !isInvalid) || disabled,
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
		/>
		<ActionLink
			v-if="modelValue && selectOptions.length > 1"
			:theme="theme"
			:disabled="disabled"
			:aria-label="t('select_restablish_field')"
			:title="t('select_restablish_field')"
			@click.prevent="resetModel"
		>
			<IconFa name="xmark" :size="20" />
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

		return `select-filter_${seed.replaceAll(" ", "") || randomId}`;
	});
	const selectOptions = computed<iFormOption[]>(() => (props.options ?? []).map(toOption));
	/**
	 * Prefers alias instead of value
	 */
	const aliasModel = computed({
		get: () => {
			const option = selectOptions.value.find(({ value }) => value === props.modelValue);

			// alias first
			return option?.alias ?? option?.value ?? "";
		},
		set(valueOrAlias: string | number) {
			// This assumes that aliases are distinct enough
			const deburr = (v: string | number) => _.deburr(String(v)).toLowerCase();
			const newModel = deburr(valueOrAlias);
			// look for alias first
			const option = selectOptions.value.find(({ alias, value }) => {
				const match = deburr(alias ?? value);

				return match === newModel;
			});

			// emit if valid
			if (option) emit("update:model-value", option.value);
		},
	});
	const isInvalid = computed<boolean>(() => {
		const option = selectOptions.value.find(({ value }) => value === props.modelValue);

		return (props.modelValue && !option) || props.invalid;
	});

	/**
	 * Clears up input model
	 */
	function resetModel() {
		emit("update:model-value", "");
	}

	// lifecycle
	if (isBrowser) supportsDatalist.value = !!HTMLDataListElement;
</script>
