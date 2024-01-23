<template>
	<div
		v-for="(model, i) in models"
		:key="input.defaults?.[i]?.placeholder || input.defaults?.[i]?.type || i"
		class="--width"
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
				<IconFa name="trash-can" size="20" />
			</ActionLink>
		</div>
		<p
			v-if="notEmptyValue(model.value, input.defaults) && !isValidValue(model.value, input)"
			class="--txtColor-danger --txtSize-sm"
		>
			{{ getInputError() }}
		</p>
	</div>
	<ActionButton
		v-if="input.multiple && input.max > models.length"
		:aria-label="t('add')"
		:theme="theme"
		:disabled="readonly"
		@click="input.addValue()"
	>
		{{ t("add") }}
	</ActionButton>
</template>

<script setup lang="ts" generic="T extends iFormValue">
	import type { WritableComputedRef } from "vue";

	import type { iFormValue } from "@open-xamu-co/ui-common-types";
	import {
		type FormInput as FormInputClass,
		useForm,
		useI18n,
	} from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useInput from "../../composables/input";
	import useHelpers from "../../composables/helpers";

	export interface iFormInputLoop<Ti> extends iUseThemeProps {
		input: FormInputClass;
		models: WritableComputedRef<Ti | Ti[]>[];
		/** Make all inputs read only by disabling them */
		readonly?: boolean;
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputLoop", inheritAttrs: true });

	const props = defineProps<iFormInputLoop<T>>();

	const { t } = useHelpers(useI18n);
	const { isValidValue, notEmptyValue } = useHelpers(useForm).utils;
	const { getInputError } = useInput(props);
</script>
