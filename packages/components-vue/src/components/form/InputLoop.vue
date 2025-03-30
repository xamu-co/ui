<template>
	<div
		v-for="(model, i) in models"
		:key="i"
		class="flx --flxColumn --flx-start-stretch --gap-5 --width-100"
	>
		<div class="flx --flxRow --flx-start-center --gap-5">
			<slot v-bind="{ i }"></slot>
			<ActionLink
				v-if="input.multiple && input.min < input.values.length"
				:aria-label="t('clear')"
				:theme="theme"
				:disabled="readonly"
				@click="input.removeValue(i)"
			>
				<IconFa name="trash-can" :size="20" />
			</ActionLink>
		</div>
		<p
			v-if="notEmptyValue(model.value, input.defaults) && !isValidValue(model.value, input)"
			class="--txtColor-danger --txtSize-sm"
		>
			{{ getInputError() }}
		</p>
	</div>
	<template v-if="input.multiple && input.max > models.length">
		<BaseBox
			v-if="!models.length"
			class="--width-100"
			:theme="theme"
			:disabled="readonly"
			button
			dashed
			transparent
		>
			<div class="flx --flx-center">
				<span>{{ t("form_no_values") }}</span>
				<ActionButton :theme="theme" :disabled="readonly" @click="input.addValue()">
					{{ t("add") }}
				</ActionButton>
			</div>
		</BaseBox>
		<ActionButton
			v-else
			:theme="theme"
			:disabled="readonly"
			:size="eSizes.XS"
			class="--txtSize-sm"
			@click="input.addValue()"
		>
			<span>{{ t("form_new_value") }}</span>
		</ActionButton>
	</template>
</template>

<script setup lang="ts" generic="T extends iFormValue">
	import type { WritableComputedRef } from "vue";

	import type { iFormValue, tFormInput } from "@open-xamu-co/ui-common-types";
	import { useForm, useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseBox from "../base/Box.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useInput from "../../composables/input";
	import { useHelpers } from "../../composables/utils";
	import { eSizes } from "@open-xamu-co/ui-common-enums";

	export interface iFormInputLoop<Ti> extends iUseThemeProps {
		input: tFormInput;
		models: WritableComputedRef<Ti | Ti[]>[];
		/** Make all inputs read only by disabling them */
		readonly?: boolean;
	}

	/**
	 * Require options
	 *
	 * TODO: automatically add additional inputs (less clicks or remove add button)
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputLoop", inheritAttrs: true });

	const props = defineProps<iFormInputLoop<T>>();

	const { t } = useHelpers(useI18n);
	const { isValidValue, notEmptyValue } = useHelpers(useForm).utils;
	const { getInputError } = useInput(props);
</script>
