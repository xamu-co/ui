<template>
	<slot v-if="errors !== undefined" name="fallback" v-bind="{ errors }">
		<BoxMessage :theme="dangerThemeValues">
			<div class="flx --flxRow --flx-center">
				<span>{{ errorMessage || t("render_error") }}</span>
			</div>
		</BoxMessage>
	</slot>
	<slot v-else></slot>
</template>
<script setup lang="ts">
	import { ref, onErrorCaptured } from "vue";

	import { useI18n, useUtils } from "@open-xamu-co/ui-common-helpers";

	import BoxMessage from "../box/Message.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";
	import useTheme from "../../composables/theme";

	interface iLoaderContentProps extends iUseThemeProps {
		errorMessage?: string;
	}

	/**
	 * Error handling
	 *
	 * @component
	 * @example
	 * <BaseErrorBoundary></BaseErrorBoundary>
	 */

	defineOptions({ name: "BaseErrorBoundary", inheritAttrs: false });

	const props = defineProps<iLoaderContentProps>();

	const { t } = useHelpers(useI18n);
	const { logger } = useHelpers(useUtils);
	const { dangerThemeValues } = useTheme(props);

	const errors = ref();

	// lifecycle
	onErrorCaptured((err) => {
		logger("ErrorBoundary", err);
		errors.value = err;

		return false;
	});
</script>
