<template>
	<BaseWrapper :wrapper="Transition" :wrap="!unwrap" name="fade" appear>
		<div
			v-if="!content || (errors && !ignoreErrors)"
			class="flx --flxColumn --flx-center --width-100"
			:class="loaderClasses"
		>
			<!-- first load -->
			<template v-if="!loading">
				<BoxMessage v-if="errors" :theme="eColors.DANGER" class="--width-100">
					<div class="flx --flxRow --flx-center">
						<span>{{ t("could_not_get_data") }}</span>
						<ActionButtonToggle
							v-if="refresh"
							:theme="eColors.DANGER"
							:tooltip="t('refresh')"
							round
							@click="refresh()"
						>
							<IconFa name="rotate-right" />
							<IconFa name="rotate-right" regular />
						</ActionButtonToggle>
					</div>
				</BoxMessage>
				<BoxMessage v-else :theme="theme" class="--width-100">
					<div class="flx --flxRow --flx-center">
						<span>{{ noContentMessage || t("nothing_to_show") }}</span>
						<ActionButtonToggle
							v-if="refresh"
							:theme="theme"
							:tooltip="t('refresh')"
							round
							@click="refresh()"
						>
							<IconFa name="rotate-right" />
							<IconFa name="rotate-right" regular />
						</ActionButtonToggle>
					</div>
				</BoxMessage>
			</template>
			<LoaderSimple v-else-if="!noLoader" :label="label" :theme="theme" />
		</div>
		<BaseWrapper v-else :wrap="!unwrap" :el="el" v-bind="$attrs">
			<div class="back --overlay" :class="{ 'is--active': loading && !noLoader }">
				<LoaderSimple :label="label" :theme="theme" />
			</div>
			<slot></slot>
		</BaseWrapper>
	</BaseWrapper>
</template>

<script setup lang="ts">
	import { Transition } from "vue";

	import type { tProps } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BaseWrapper from "../base/Wrapper.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderSimple from "./Simple.vue";
	import BoxMessage from "../box/Message.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	interface iLoaderContentProps extends iUseThemeProps {
		/**
		 * has content
		 */
		content?: boolean;
		/**
		 * is loading
		 */
		loading?: boolean;
		/**
		 * Hide loader
		 */
		noLoader?: boolean;
		/**
		 * has errors
		 */
		errors?: unknown;
		/**
		 * Ignore errors and display existing content.
		 */
		ignoreErrors?: boolean;
		noContentMessage?: string;
		/**
		 * Loader label
		 */
		label?: string;
		/**
		 * Refresh the content
		 */
		refresh?: () => unknown;
		/**
		 * Do not wrap
		 */
		unwrap?: boolean;
		/**
		 * Component or tag to render
		 */
		el?: vComponent | string;
		loaderClasses?: tProps<string>;
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
	defineProps<iLoaderContentProps>();

	const { t } = useHelpers(useI18n);
</script>
