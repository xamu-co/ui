<template>
	<BaseWrapper :el="Transition" :wrap="!unwrap" name="fade" appear>
		<div
			v-if="!content || errors"
			class="flx --flxColumn --flx-center --width"
			:class="loaderClasses"
		>
			<!-- first load -->
			<template v-if="!loading">
				<BoxMessage v-if="errors" :theme="eColors.DANGER">
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
				<BoxMessage v-else :theme="theme">
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
			<LoaderSimple v-else :label="label" :theme="theme" />
		</div>
		<BaseWrapper v-else :wrap="!unwrap" :el="el" v-bind="$attrs">
			<div v-if="loading" class="back --overlay is--active">
				<LoaderSimple :label="label" :theme="theme" />
			</div>
			<slot></slot>
		</BaseWrapper>
	</BaseWrapper>
</template>

<script setup lang="ts">
	import {
		Component as VueComponent,
		FunctionalComponent,
		DefineComponent,
		Transition,
	} from "vue";

	import type { tProps } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BaseWrapper from "../base/Wrapper.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderSimple from "./Simple.vue";
	import BoxMessage from "../box/Message.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useHelpers from "../../composables/helpers";

	interface iLoaderContentProps extends iUseThemeProps {
		/**
		 * has content
		 * content was loaded but didnt existed
		 */
		content?: boolean;
		/**
		 * is loading
		 */
		loading?: boolean;
		/**
		 * is loading
		 */
		errors?: boolean;
		noContentMessage?: string;
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
		el?: VueComponent | FunctionalComponent | DefineComponent | string;
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
