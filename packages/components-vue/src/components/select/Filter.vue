<template>
	<LoaderContent
		class="flx --flxRow --flx-start-center --gap-5"
		v-bind="$attrs"
		:loading="pendingRemoteOptions"
		:theme="theme"
		content
	>
		<ActionLink
			v-if="modelValue && (selectOptions.length > 1 || !Array.isArray(props.options))"
			:theme="theme"
			:disabled="disabled"
			:tooltip="t('select_restablish_field')"
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
				placeholder: placeholder || t('select_filter_options'),
				disabled: (!!modelValue && !isInvalid) || disabled,
				invalid: isInvalid,
				icon,
				iconProps,
			}"
			class="--flx"
		/>
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
					optionsFilter: options && !Array.isArray(options),
				}"
				class="--flx"
			/>
		</datalist>
	</LoaderContent>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed, ref } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";
	import debounce from "lodash-es/debounce";
	import { Md5 } from "ts-md5";

	import type {
		iFormIconProps,
		iFormOption,
		tOptionsLoaderFn,
	} from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import SelectSimple from "./Simple.vue";
	import InputText from "../input/Text.vue";
	import ActionLink from "../action/Link.vue";
	import IconFa from "../icon/Fa.vue";
	import LoaderContent from "../loader/Content.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iSelectProps,
	} from "../../types/props";
	import useAsyncDataFn from "../../composables/async";
	import { useHelpers } from "../../composables/utils";

	interface iSelectFilterProps
		extends iSelectProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {
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

	let useAsyncDataLocal: typeof useAsyncDataFn;

	try {
		// @ts-expect-error useAsyncData is only available in nuxt context
		useAsyncDataLocal = useAsyncData;
	} catch (err) {
		useAsyncDataLocal = useAsyncDataFn;
	}

	/** Local model for the filter */
	const queryModel = ref<string | number>("");

	/**
	 * Loader for the options.
	 * Always a function, even when a static list is provided.
	 */
	const optionsLoader = computed<tOptionsLoaderFn>(() => {
		const rawOptions = props.options;

		if (rawOptions && !Array.isArray(rawOptions)) return rawOptions;

		const list = (rawOptions || []).map(toOption);

		return () => list;
	});

	/** Prefer a predictable identifier */
	const selectFilterName = computed(() => {
		const seed = deburr(props.placeholder || props.title);

		return props.name || props.id || Md5.hashStr(`select-filter-${seed}`);
	});

	const selectOptions = computed<iFormOption[]>(() => {
		let options = remoteOptions.value ?? [];
		const value = props.modelValue;

		// Filter out hidden options
		options = options.filter(({ hidden }) => !hidden);

		if (value && !options.find(({ value: val }) => val === value)) {
			// queryModel as alias fallback (After a search)
			return [...options, { value, alias: queryModel.value.toString() }];
		}

		return options;
	});

	const aliasModel = computed({
		get() {
			const option = selectOptions.value.find(({ value }) => value === props.modelValue);

			return String(option?.alias ?? option?.value ?? "");
		},
		set(valueOrAlias: string | number) {
			// Keep queryModel updated with what is being typed
			debounceQueryModelSet(valueOrAlias);

			// This assumes that aliases are distinct enough
			const deburrer = (v: string | number) => deburr(String(v)).toLowerCase();
			const newModel = deburrer(valueOrAlias);
			// look for alias first
			const option = selectOptions.value.find(({ alias, value }) => {
				const match = deburrer(alias ?? value);

				return match === newModel;
			});

			if (option) emit("update:model-value", option.value);
		},
	});
	const isInvalid = computed<boolean>(() => {
		const option = selectOptions.value.find(({ value }) => value === props.modelValue);

		return (props.modelValue && !option) || props.invalid;
	});
	const properties = computed(() => {
		return {
			...omit(props, ["modelValue", "options"]),
			hidden: props.hidden,
			size: props.size,
			active: props.active,
			state: props.state,
			theme: props.theme,
		};
	});

	// Do not await, to avoid using suspense
	const { data: remoteOptions, pending: pendingRemoteOptions } = useAsyncDataLocal<iFormOption[]>(
		selectFilterName.value,
		async (_, { signal } = {}) => {
			/** Fallbacks queryModel to selected value */
			const query = queryModel.value || props.modelValue;
			const result = await Promise.resolve(optionsLoader.value(query, signal));

			return result || [];
		},
		{
			default: () => [],
			watch: [queryModel],
			server: false,
		}
	);

	function resetModel() {
		queryModel.value = "";
		emit("update:model-value", "");
	}

	const debounceQueryModelSet = debounce((value: string | number) => {
		queryModel.value = value;
	}, 300);
</script>
