<template>
	<component
		:is="actionComponent"
		v-bind="{ ...$attrs, ...props, ...getHref }"
		:type="currentTag === 'button' && !to && !href ? type || 'button' : null"
		:tabindex="(props.disabled && '-1') || props.tabindex || null"
		:class="classes"
	>
		<slot>
			<template v-if="mailto">{{ mailto }}</template>
			<template v-else-if="tel">{{ getReadableTelNumber }}</template>
		</slot>
	</component>
</template>

<script setup lang="ts">
	import { computed, inject } from "vue";

	import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import type { iActionProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	/**
	 * Action Prototype
	 *
	 * @prototype
	 * @example
	 * <BaseAction></BaseAction>
	 */

	defineOptions({ name: "BaseAction", inheritAttrs: false });

	const props = defineProps<iActionProps>();

	const xamuOptions = inject<iPluginOptions>("xamu");
	const { getModifierClasses: GMC } = useHelpers(useUtils);

	const currentTag = computed(() => {
		if (!props.mailto && !props.tel && !props.href) return props.tag ?? "button";

		return "a";
	});

	const actionComponent = computed(() => {
		return (props.to && xamuOptions?.routerComponent) || currentTag.value;
	});

	/**
	 * Base classes for action component
	 */
	const classes = computed<string[]>(() => {
		const round = props.round || (typeof props.round === "string" && !props.round.length);

		return [
			round ? GMC(round, { modifier: "round" }) : [],
			props.toggle ? GMC([props.toggle], { prefix: "toggle" }) : [],
			props.toggleState ? GMC([props.toggleState].flat(2), { prefix: "is" }) : [],
		].flat(2);
	});
	const indicativeNumber = computed(() => {
		const { indicative = "CO+57" } = props;

		return indicative?.toString().split("+")[1] || indicative;
	});
	/**
	 * Human readable number
	 */
	const getReadableTelNumber = computed<string>(() => {
		const tel = props.tel || "";
		const number = `${tel.substring(0, 3)}-${tel.substring(3, 6)}-${tel.substring(6)}`;

		return `(+${indicativeNumber.value}) ${number}`;
	});
	const toMailto = computed(() => {
		if (props.to || !props.mailto) return "";

		return `mailto:${props.mailto}`;
	});
	const toTel = computed(() => {
		if (props.to || !props.tel) return "";

		let whatsappPath = `https://wa.me/${indicativeNumber.value}${props.tel}`;
		const telPath = `tel:+(${indicativeNumber.value})${props.tel}`;

		if (props.whatsapp && typeof props.whatsapp == "string") {
			whatsappPath += `?=text=${encodeURI(props.whatsapp)}`;
		}

		return props.whatsapp ? whatsappPath : telPath;
	});
	const getHref = computed(() => {
		const href = props.href || toMailto.value || toTel.value;

		if (!href) return {};

		return { to: undefined, href, target: props.target || "_blank" };
	});
</script>
