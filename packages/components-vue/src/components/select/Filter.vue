<template>
	<BaseWrapper :id="selectFilterName" el="datalist" :wrap="supportsDatalist">
		<!-- Select is also used as fallback for older browsers -->
		<SelectSimple
			v-model="aliasModel"
			v-bind="{
				...$attrs,
				...omit(props, 'modelValue'),
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
	</BaseWrapper>
	<div v-if="supportsDatalist" class="flx --flxRow --flx-start-center --gap-5" v-bind="$attrs">
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
				...omit(props, ['modelValue', 'autocomplete']),
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
	</div>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed, ref } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";
	import { Md5 } from "ts-md5";

	import type { iFormIconProps, iFormOption } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n, useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "../base/Wrapper.vue";
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
	const { isBrowser } = useHelpers(useUtils);

	const supportsDatalist = ref(false);
	/** Prefer a predictable identifier */
	const selectFilterName = computed(() => {
		const seed = deburr(props.placeholder || props.title);

		return props.name || props.id || Md5.hashStr(`select-filter-${seed}`);
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

	/**
	 * Clears up input model
	 */
	function resetModel() {
		emit("update:model-value", "");
	}

	// lifecycle
	if (isBrowser) {
		const isFunction = typeof HTMLDataListElement === "function";
		const hasOptions = "options" in document.createElement("datalist");
		const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
		const isAndroid = navigator.platform.toLowerCase().includes("android");
		/**
		 * Datalist support
		 *
		 * Does not work on firefox android
		 * @see https://caniuse.com/datalist
		 */
		const isFirefoxAndroid = isFirefox && isAndroid;

		supportsDatalist.value = isFunction && hasOptions && !isFirefoxAndroid;
	}
</script>
