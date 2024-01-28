<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="flx --flxRow --flx-start-center --gap-5" :class="classes">
		<!-- Boolean only -->
		<InputToggle
			v-if="typeof value === 'boolean'"
			:label="verbose ? property?.alias : undefined"
			:checked="value"
			:theme="theme"
			disabled
		/>

		<!-- String, Color -->
		<InputColor
			v-else-if="typeof value === 'string' && validator.isHexColor(value)"
			:model-value="value"
			:theme="theme"
			disabled
		/>

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
		>
			<IconFa v-if="verbose" name="envelope" force-regular />
			<span>{{ value }}</span>
		</ActionLink>

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
				<IconFa name="arrow-up-right-from-square" />
				<span>{{ t("table_open_url") }}</span>
			</ActionLink>
		</template>

		<!-- String, Long text -->
		<Modal
			v-else-if="typeof value === 'string' && value.length > maxLength"
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
					<IconFa name="align-left" />
					<span>{{ value.substring(0, 22) }}...</span>
				</ActionLink>
			</template>
			<template #default="{ model, invertedTheme }">
				<!-- Do not render html -->
				<BoxMessage
					v-if="model"
					:text="value"
					:theme="invertedTheme"
					class="--txtAlign"
					:class="classes"
				/>
			</template>
		</Modal>

		<!-- Plain data, short string, number or no data -->
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

	import IconFa from "../icon/Fa.vue";
	import BaseAction from "../base/Action.vue";
	import BaseImg from "../base/Img.vue";
	import InputToggle from "../input/Toggle.vue";
	import InputColor from "../input/Color.vue";
	import ActionLink from "../action/Link.vue";
	import Modal from "../Modal.vue";
	import BoxMessage from "../box/Message.vue";

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
		readonly?: boolean;
		classes?: tProps<string>;
		modalTarget?: string | RendererElement;
		modalTheme?: tThemeTuple | tProp<tThemeModifier>;
		verbose?: boolean;
	}

	/**
	 * Simple value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueSimple", inheritAttrs: false });

	const props = defineProps<iValueSimpleProps<P, T>>();

	const xamuOptions = inject<iPluginOptions>("xamu");
	const { t } = useHelpers(useI18n);

	const locale = computed(() => {
		const lang = xamuOptions?.lang || "en";
		const country = xamuOptions?.country || "US";

		return `${lang}-${country}`;
	});

	const maxLength = computed(() => (props.verbose ? 66 : 33));

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
