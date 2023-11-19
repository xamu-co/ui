<template>
	<BaseWrapper :wrap="!!$slots.toggle">
		<div
			v-if="$slots.toggle"
			ref="toggleRef"
			class="only--active toggle--dropdown"
			:class="{ 'is--active': localModel }"
		>
			<slot name="toggle" v-bind="{ model, setModel }"></slot>
		</div>
		<Modal v-model="localModel" :disabled="!isModal" :theme="theme">
			<div
				ref="dropdownRef"
				:class="{ [getClassesString([modifiersClasses, dropdownClasses])]: !isModal }"
			>
				<slot v-bind="{ model, setModel }"></slot>
			</div>
		</Modal>
	</BaseWrapper>
</template>

<script setup lang="ts">
	import {
		computed,
		ref,
		watch,
		onMounted,
		onUnmounted,
		Component as VueComponent,
		DefineComponent,
		FunctionalComponent,
	} from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "./base/Wrapper.vue";
	import Modal from "./Modal.vue";

	import type { iUseModifiersProps, iUseThemeProps } from "../types/props";
	import useBrowser from "../composables/browser";
	import useModifiers from "../composables/modifiers";
	import useTheme from "../composables/theme";
	import useHelpers from "../composables/helpers";

	type tAlignFirstX = "right" | "left";
	type tAlignFirstY = "top" | "bottom";

	type tAlignX = [tAlignFirstX, "top" | "center" | "bottom"];
	type tAlignY = [tAlignFirstY, "right" | "center" | "left"];

	type tAlign = tAlignFirstX | tAlignFirstY | tAlignX | tAlignY;

	interface iDropdownProps extends iUseModifiersProps, iUseThemeProps {
		position?: tAlign;
		/**
		 * Component or tag to render
		 */
		el?: VueComponent | FunctionalComponent | DefineComponent | string;
		/**
		 * Shows/hides the dropdown
		 * @private
		 */
		modelValue?: boolean;
	}

	/**
	 * Dropdown Prototype
	 *
	 * @prototype
	 */

	defineOptions({ name: "DropdownSimple", inheritAttrs: false });

	const props = defineProps<iDropdownProps>();
	const emit = defineEmits(["close", "update:model-value"]);

	const { getModifierClasses: GMC, getClassesString } = useHelpers(useUtils);
	const { themeValues } = useTheme(props);
	const { tabletMqRange } = useBrowser();
	const { modifiersClasses } = useModifiers(props);

	const toggleRef = ref<HTMLElement>();
	const dropdownRef = ref<HTMLElement>();
	const isModal = ref(false);
	const model = ref(props.modelValue);
	const dropdownClasses = computed<string>(() => {
		return getClassesString([
			"dropdown",
			`--bgColor-${themeValues.value[1]}`,
			GMC([{ active: props.modelValue }], { prefix: "is" }),
			GMC([[props.position ?? "bottom"].flat(2).join("-")], {
				modifier: "position",
				divider: "-",
			}),
		]);
	});

	function setModel(value = !model.value) {
		return (model.value = value);
	}

	function closeDropdown() {
		emit("close");
		emit("update:model-value", setModel(false));
	}
	function clickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const toggle = toggleRef.value;
		const dropdown = dropdownRef.value;

		if (dropdown === target || dropdown?.contains(target) || toggle?.contains(target)) return;

		closeDropdown();
	}

	/**
	 * Dropdown model
	 */
	const localModel = computed({
		get: () => props.modelValue || model.value,
		set: closeDropdown,
	});

	// lifecycle
	watch(
		tabletMqRange,
		(value) => {
			isModal.value = value && props.modelValue !== null;
			closeDropdown();
		},
		{ immediate: false }
	);
	onMounted(() => {
		document.addEventListener("click", clickOutside, true);
	});
	onUnmounted(() => {
		document.removeEventListener("click", clickOutside, true);
	});
</script>
