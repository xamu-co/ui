<template>
	<DropdownSimple
		:position="['bottom', 'center']"
		:class="$attrs.class"
		classes="select-filter flx --flxColumn --flx-start-stretch --gap-10:md --width-100"
		:theme="theme"
		:disabled="disabled"
		:responsive-range="compact ? laptopMqRange : tabletMqRange"
		invert-theme
	>
		<template #toggle="{ setModel, isModal }">
			<ActionButton
				v-if="isModal"
				class="--flxJustify-start"
				:class="{ '--width-100': !compact }"
				:theme="theme"
				:disabled="disabled"
				@click="() => setModel(true)"
			>
				<IconFa v-if="icon" :name="icon" v-bind="iconProps" />
				<span class="--txtAlign-left --flx" :class="{ '--hidden:lg-inv': compact }">
					{{
						selectedOption?.alias ||
						selectedOption?.value ||
						placeholder ||
						t("select_filter_options")
					}}
				</span>
				<IconFa name="chevron-down" indicator />
			</ActionButton>
			<form
				v-else
				class="flx --flxRow --flx-center --gap-10"
				@submit.prevent="() => setModel(true)"
			>
				<div class="back flx --flxRow --flx-end-center --pX-10">
					<ActionLink
						v-if="search || modelValue"
						:tooltip="t('select_restablish_field')"
						:title="t('select_restablish_field')"
						tooltip-position="left"
						tooltip-as-text
						:theme="theme"
						:disabled="disabled"
						class="--index-1"
						@click.prevent="() => setFilter(undefined, setModel)"
					>
						<IconFa name="xmark" :size="20" />
					</ActionLink>
				</div>
				<InputText
					v-model="search"
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
					role="combobox"
					class="--flx"
					@focus="() => setModel(true)"
				/>
			</form>
		</template>
		<template #default="{ invertedTheme, setModel, isModal }">
			<nav
				class="dropdown-item list flx --flxColumn --gap-20 --minWidth-220 --maxWidth-100"
				:class="[`--txtColor-${themeValues[0]}`]"
			>
				<ul class="list-group --gap-5">
					<li v-if="title">
						<p class="--txtSize-xs">{{ title }}</p>
					</li>
					<!-- Mobile fallback input inside modal -->
					<li v-if="isModal" class="flx --flxRow --flx-center --gap-10">
						<div class="back flx --flxRow --flx-end-center --pX-10">
							<ActionLink
								v-if="search || modelValue"
								:tooltip="t('select_restablish_field')"
								:title="t('select_restablish_field')"
								tooltip-position="left"
								tooltip-as-text
								:theme="theme"
								class="--index-1"
								@click.prevent="() => setFilter(undefined, setModel)"
							>
								<IconFa name="xmark" :size="20" />
							</ActionLink>
						</div>
						<InputText
							v-model="search"
							v-bind="{ icon, placeholder, theme }"
							class="--width-100"
							input-classes="--pRight-30"
							:theme="theme"
						/>
					</li>
					<li>
						<LoaderContent
							class="flx --flxColumn --flx-start-stretch --gap-5"
							:content="!!selectOptions?.length"
							:loading="pendingSelectOptions"
							:theme="theme"
							:label="t('select_filter_searching')"
							:no-content-message="
								t(
									'select_filter_no_content',
									String(search || modelValue || '').length - 1
								)
							"
							el="ul"
						>
							<li v-for="option in selectOptions" :key="option.value">
								<ActionLink
									:title="String(option.value)"
									:aria-label="
										t('select_filter_select_value', {
											value: option.alias || option.value,
										})
									"
									:theme="invertedTheme"
									@click.prevent="() => setFilter(option, setModel)"
								>
									<IconFa v-if="option.icon" :name="option.icon" />
									<figure
										v-else-if="option.pattern"
										class="avatar --size-xs --bdr"
										:class="`--bdrColor-${themeValues[1]}`"
										:style="
											isColor(option.pattern)
												? { backgroundColor: option.pattern }
												: { backgroundImage: `url('${option.pattern}')` }
										"
									></figure>
									<span class="--txtWrap">
										{{ option.alias ?? option.value }}
									</span>
								</ActionLink>
							</li>
						</LoaderContent>
					</li>
				</ul>
			</nav>
		</template>
	</DropdownSimple>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed, ref, useId, watch } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";
	import { Md5 } from "ts-md5";

	import type {
		iFormIconProps,
		iFormOption,
		tOptionsLoaderFn,
	} from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import DropdownSimple from "../dropdown/Simple.vue";
	import InputText from "../input/Text.vue";
	import ActionButton from "../action/Button.vue";
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
	import useTheme from "../../composables/theme";
	import { isColor, useHelpers } from "../../composables/utils";
	import useBrowser from "../../composables/browser";

	interface iSelectFilterProps
		extends iSelectProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {
		icon?: IconName;
		iconProps?: iFormIconProps;
		/** Use compact design on mobile */
		compact?: boolean;
		/**
		 * Vue model value
		 * @private
		 */
		modelValue?: string | number;
	}

	/**
	 * Select element with filtering and dropdown overlay
	 *
	 * @component
	 */

	defineOptions({ name: "SelectFilter", inheritAttrs: false });

	const props = defineProps<iSelectFilterProps>();
	const emit = defineEmits<{ (e: "update:model-value", value: string | number): any }>();

	const { t } = useHelpers(useI18n);
	const { themeValues } = useTheme(props);
	const { tabletMqRange, laptopMqRange } = useBrowser();

	let useAsyncDataLocal: typeof useAsyncDataFn;

	try {
		// @ts-expect-error useAsyncData is only available in nuxt context
		useAsyncDataLocal = useAsyncData;
	} catch (err) {
		useAsyncDataLocal = useAsyncDataFn;
	}

	const fallbackName = useId();

	/** Local model for the filter */
	const search = ref<string>();

	/**
	 * Loader for the options.
	 * Always a function, even when a static list is provided.
	 */
	const optionsLoader = computed<tOptionsLoaderFn>(() => {
		const rawOptions = props.options;

		if (rawOptions && !Array.isArray(rawOptions)) return rawOptions;

		const list = (rawOptions || []).map(toOption);

		// Fuzzy like search
		return (query) => {
			if (!query) return list;

			const lowerQuery = deburr(String(query)).toLowerCase();

			return list.filter(({ alias, value }) => {
				if (String(props.modelValue) === String(value)) return true;

				const aliasStr = deburr(String(alias || value)).toLowerCase();

				return aliasStr.includes(lowerQuery);
			});
		};
	});

	/** Prefer a predictable identifier */
	const selectFilterName = computed(() => {
		if (props.name) return props.name;

		const seed = deburr(props.id || props.placeholder || props.title);

		return seed ? Md5.hashStr(`select-filter-${seed}`) : fallbackName;
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
	const { data: selectOptions, pending: pendingSelectOptions } = useAsyncDataLocal<iFormOption[]>(
		selectFilterName.value,
		async (_, { signal } = {}) => {
			/** Fallbacks search to selected value */
			const query = search.value || props.modelValue;
			const result = await Promise.resolve(optionsLoader.value(query, signal));

			return result || [];
		},
		{ default: () => [], watch: [search, () => props.options] }
	);

	const selectedOption = computed(() => {
		return selectOptions.value?.find(({ value }) => String(value) === String(props.modelValue));
	});

	const isInvalid = computed<boolean>(() => {
		const option = selectedOption.value;

		return (props.modelValue && !option) || props.invalid;
	});

	function setFilter(option?: iFormOption, setModel?: (v?: boolean) => void) {
		emit("update:model-value", option?.value?.toString() || "");
		search.value = option?.alias || "";

		if (option) setModel?.(false);
	}

	// lifecycle
	watch(
		search,
		(newValue) => {
			if (!selectedOption.value && newValue === "") emit("update:model-value", "");
		},
		{ immediate: false }
	);
	// Set search on first load from modelValue
	watch(
		selectedOption,
		(option) => {
			if (option && search.value === undefined) {
				search.value = String(option.alias || option.value || "");
			}
		},
		{ immediate: true }
	);
</script>
