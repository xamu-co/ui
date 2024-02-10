<template>
	<slot v-if="errors !== undefined" name="fallback" v-bind="{ errors }">
		<BoxMessage :theme="[eColors.DANGER, themeValues[0]]">
			<div class="flx --flxRow --flx-center">
				<span>{{ errorMessage || t("render_error") }}</span>
			</div>
		</BoxMessage>
	</slot>
	<slot v-else></slot>
</template>
<script setup lang="ts">
	import { ref, onErrorCaptured } from "vue";

	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BoxMessage from "../box/Message.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";
	import useTheme from "../../composables/theme";

	interface iLoaderContentProps extends iUseThemeProps {
		errorMessage?: string;
	}

	/**
	 * Content loader
	 *
	 * Display or hide content while it is loading
	 *
	 * @component
	 * @example
	 * <LoaderContent></LoaderContent>
	 */

	defineOptions({ name: "LoaderContent", inheritAttrs: false });

	const props = defineProps<iLoaderContentProps>();

	const { t } = useHelpers(useI18n);
	const { themeValues } = useTheme(props);

	const errors = ref();

	// lifecycle
	onErrorCaptured((err) => {
		console.error(err);
		errors.value = err;

		return false;
	});
</script>
