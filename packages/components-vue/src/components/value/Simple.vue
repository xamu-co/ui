<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="flx --flxRow --flx-start-center --gap-5" :class="classes">
		<!-- Boolean only -->
		<InputToggle v-if="typeof value === 'boolean'" :checked="value" :theme="theme" disabled />

		<!-- String, Date -->
		<span
			v-else-if="(typeof value === 'string' && isDate(value)) || value instanceof Date"
			:title="String(value)"
		>
			{{ timeAgo(new Date(value), locale) }}
		</span>

		<!-- String, Email -->
		<ActionLink
			v-else-if="typeof value === 'string' && validator.isEmail(value)"
			:mailto="value"
			:theme="theme"
		/>

		<!-- String, URL -->
		<template
			v-else-if="typeof value === 'string' && validator.isURL(value, { require_host: false })"
		>
			<!-- Image URL -->
			<!-- TODO: trigger gallery/slideshow component/modal -->
			<BaseAction v-if="isImgUrl(value)" class="avatar" :href="value" target="_blank">
				<BaseImg preset="avatar" :src="value" :alt="value" />
			</BaseAction>

			<!-- Plain URL -->
			<ActionLink v-else :theme="theme" :href="value" target="_blank">
				{{ t("table_open_url") }}
			</ActionLink>
		</template>

		<!-- String, Long text -->
		<Modal
			v-else-if="typeof value === 'string' && value.length > 66"
			class="--txtSize"
			:theme="modalTheme || theme"
			:title="property?.alias"
			:target="modalTarget"
		>
			<template #toggle="{ toggleModal }">
				<ActionLink
					:theme="theme"
					:tooltip="t('see_value')"
					tooltip-as-text
					tooltip-position="bottom"
					@click="toggleModal"
				>
					{{ value.substring(0, 33) }}...
				</ActionLink>
			</template>
			<template #default="{ model }">
				<!-- Do not render html -->
				<div v-if="model" class="txt" :class="classes">
					<p>{{ value }}</p>
				</div>
			</template>
		</Modal>

		<!-- Plain data, string, number or no data -->
		<span v-else>
			{{ typeof value === "string" || typeof value === "number" ? value ?? "-" : "-" }}
		</span>
	</div>
</template>

<script setup lang="ts" generic="P extends Record<string, any>, T">
	import { computed, inject, type RendererElement } from "vue";
	import validator from "validator";

	import type {
		tProps,
		tThemeTuple,
		tProp,
		tThemeModifier,
		iPluginOptions,
		iProperty,
	} from "@open-xamu-co/ui-common-types";
	import { timeAgo, useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseAction from "../base/Action.vue";
	import BaseImg from "../base/Img.vue";
	import InputToggle from "../input/Toggle.vue";
	import ActionLink from "../action/Link.vue";
	import Modal from "../Modal.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useHelpers from "../../composables/helpers";

	interface iValueSimpleProps<Pi extends Record<string, any>, Ti> extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: Ti;
		/**
		 * Cell column property
		 */
		property?: iProperty<Pi>;
		readOnly?: boolean;
		classes?: tProps<string>;
		modalTarget?: string | RendererElement;
		modalTheme?: tThemeTuple | tProp<tThemeModifier>;
	}

	/**
	 * Simple value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueSimple", inheritAttrs: false });
	defineProps<iValueSimpleProps<P, T>>();

	const xamuOptions = inject<iPluginOptions>("xamu");
	const { t } = useHelpers(useI18n);

	const locale = computed(() => {
		const lang = xamuOptions?.lang || "en";
		const country = xamuOptions?.country || "US";

		return `${lang}-${country}`;
	});

	/**
	 * Url is of image type
	 * TODO: improve image url matching
	 */
	function isImgUrl(url: string): boolean {
		const [firstPart] = url.split("?");

		// host is required
		if (xamuOptions?.imageHosts && validator.isURL(firstPart)) {
			const url = new URL(firstPart);

			if (xamuOptions.imageHosts.includes(url.host)) return true;
		}

		return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(firstPart);
	}
	function isDate(dateString: string): boolean {
		return validator.isDate(dateString) || !isNaN(Date.parse(dateString));
	}
</script>
