<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="flx --flxRow --flx-start-center --gap-5" :class="classes">
		<!-- Boolean only -->
		<span v-if="typeof value === 'boolean'" :title="property?.alias">
			<InputToggle
				:label="verbose ? property?.alias : undefined"
				:checked="value"
				:theme="theme"
				:size="size"
				disabled
			/>
		</span>
		<!-- String, Color -->
		<span
			v-else-if="typeof value === 'string' && value.includes('#') && isHexColor(value)"
			:title="property?.alias"
		>
			<InputColor :model-value="value" :theme="theme" :size="size" disabled />
		</span>
		<!-- String, Date -->
		<span
			v-else-if="
				(typeof value === 'string' && isDate(value)) ||
				typeof value?.getMonth === 'function'
			"
			:title="String(value)"
		>
			{{ timeAgo(new Date(value), locale) }}
		</span>
		<!-- String, Email -->
		<ActionLink
			v-else-if="typeof value === 'string' && isEmail(value)"
			:mailto="value"
			:size="size"
			:theme="theme"
		>
			<IconFa v-if="verbose" name="envelope" force-regular />
			<span>{{ value }}</span>
		</ActionLink>
		<!-- String, Image path -->
		<BaseAction
			v-else-if="typeof value === 'string' && isImgUrl(value)"
			class="avatar --size-sm"
			:href="value"
			target="_blank"
		>
			<BaseImg
				preset="avatar"
				class="--bgColor-none"
				:src="value"
				:alt="value"
				:placeholder="property?.imagePlaceholder"
				@error="property?.onImageError"
			/>
		</BaseAction>
		<!-- String, URL -->
		<ActionLink
			v-else-if="typeof value === 'string' && isURL(value)"
			:theme="theme"
			:href="value"
			:size="size"
			target="_blank"
		>
			<IconFa name="arrow-up-right-from-square" />
			<span>{{ t("table_open_url") }}</span>
		</ActionLink>
		<!-- String, Long text -->
		<Modal
			v-else-if="typeof value === 'string' && value.length > maxLength"
			class="--txtSize"
			:title="property?.alias"
			v-bind="{ theme, ...modalProps }"
		>
			<template #toggle="{ toggleModal }">
				<ActionLink
					:theme="theme"
					:tooltip="t('see_value')"
					tooltip-as-text
					tooltip-position="bottom"
					:size="size"
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
					class="--txtAlign --txtWrap --width-100"
					:class="classes"
				/>
			</template>
		</Modal>
		<!-- Plain data, short string, number or no data -->
		<span v-else :title="property?.alias">
			{{
				(typeof value === "string" && value.length) || typeof value === "number"
					? (value ?? "-")
					: "-"
			}}
		</span>
	</div>
</template>

<script setup lang="ts" generic="P extends Record<string, any>">
	import { computed, inject, type AllowedComponentProps } from "vue";
	import isURL from "validator/lib/isURL";
	import isEmail from "validator/lib/isEmail";
	import isHexColor from "validator/lib/isHexColor";
	import validatorIsDate from "validator/lib/isDate";

	import type {
		tProps,
		tSizeModifier,
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
	import Modal from "../modal/Simple.vue";
	import BoxMessage from "../box/Message.vue";

	import type { iModalProps, iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	/**
	 * Simple value
	 *
	 * TODO: trigger gallery/slideshow, component/modal (Complex value)
	 *
	 * @component
	 */

	export interface iValueSimpleProps<Pi extends Record<string, any>> extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: Pi[keyof Pi];
		/**
		 * Cell column property
		 */
		property?: iProperty<Pi>;
		readonly?: boolean;
		classes?: tProps<string>;
		modalProps?: iModalProps & AllowedComponentProps;
		verbose?: boolean;
		size?: tSizeModifier;
	}

	/**
	 * Simple value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueSimple", inheritAttrs: false });

	const props = defineProps<iValueSimpleProps<P>>();

	const { lang = "en", country = "US", imageHosts = [] } = inject<iPluginOptions>("xamu") || {};
	const { t } = useHelpers(useI18n);

	const locale = computed(() => {
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
		if (
			isURL(firstPart, { protocols: ["http", "https"], require_protocol: true }) &&
			imageHosts.length
		) {
			const url = new URL(firstPart);

			if (imageHosts.includes(url.host)) return true;
		}

		return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(firstPart);
	}
	function isDate(dateString: string): boolean {
		try {
			// bypass numbers
			if (!!Number(dateString) || !dateString.includes(":")) return false;

			const property = String(props.property?.value);

			// TODO: improve date bypassing for phones
			if (["tel", "phone", "cel"].some((v) => property.includes(v))) return false;

			return validatorIsDate(dateString) || !isNaN(Date.parse(dateString));
		} catch (err) {
			// ignore errors
			return false;
		}
	}
</script>
