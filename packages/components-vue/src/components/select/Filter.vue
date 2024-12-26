<template>
	<div class="flx --flxRow --flx-start-center --gap-5" v-bind="$attrs">
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
		<InputText
			v-model="aliasModel"
			:list="selectFilterName"
			autocomplete="off"
			v-bind="{
				...properties,
				type: 'text',
				placeholder: t('select_filter_options'),
				disabled: (!!modelValue && !isInvalid) || disabled,
				invalid: isInvalid,
				icon,
				iconProps,
			}"
			class="--flx"
		/>
	</div>
	<datalist :id="selectFilterName">
		<!-- Select is also used as fallback for older browsers -->
		<SelectSimple
			v-model="aliasModel"
			v-bind="{
				...$attrs,
				...properties,
				options: selectOptions.map(({ value, alias }) => ({
					alias,
					value: alias ?? value,
				})),
				placeholder: placeholder ?? t('select_placeholder'),
				disabled,
				invalid,
			}"
		/>
	</datalist>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";
	import { Md5 } from "ts-md5";

	import type { iFormIconProps, iFormOption } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

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
	import { useHelpers } from "../../composables/utils";

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

	/** Prefer a predictable identifier */
	const selectFilterName = computed(() => {
		const seed = deburr(props.placeholder || props.title);

		return props.name || props.id || Md5.hashStr(`select-filter-${seed}`);
	});
	const selectOptions = computed<iFormOption[]>(() => {
		return (props.options || []).map(toOption).filter(({ hidden }) => !hidden);
	});
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
			const deburrer = (v: string | number) => deburr(String(v)).toLowerCase();
			const newModel = deburrer(valueOrAlias);
			// look for alias first
			const option = selectOptions.value.find(({ alias, value }) => {
				const match = deburrer(alias ?? value);

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
	const properties = computed(() => {
		return {
			...omit(props, ["modelValue"]),
			hidden: props.hidden,
			size: props.size,
			active: props.active,
			state: props.state,
			theme: props.theme,
		};
	});

	/**
	 * Clears up input model
	 */
	function resetModel() {
		emit("update:model-value", "");
	}
</script>
