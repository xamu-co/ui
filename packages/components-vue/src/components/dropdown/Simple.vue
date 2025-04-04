<template>
	<BaseWrapper :wrap="!!$slots.toggle" :wrapper="el" :class="$attrs.class">
		<div
			v-if="$slots.toggle"
			ref="toggleRef"
			class="only--active toggle--dropdown"
			:class="{ 'is--active': localModel }"
		>
			<slot name="toggle" v-bind="{ model, setModel }"></slot>
		</div>
		<Modal
			v-model="localModel"
			v-bind="{ ...modalProps, theme, invertTheme, disabled: !isModal }"
		>
			<template #default="{ modalRef }">
				<div ref="dropdownRef" :class="dropdownClasses">
					<slot
						v-bind="{
							model,
							isModal,
							setModel,
							modalRef,
							dropdownRef,
							invertedTheme: invertedThemeValues,
						}"
					></slot>
					<slot
						v-if="!isModal"
						name="actions"
						v-bind="{
							model,
							isModal,
							setModel,
							modalRef,
							dropdownRef,
							invertedTheme: invertedThemeValues,
						}"
					></slot>
				</div>
			</template>
			<template v-if="isModal" #footer-actions="{ modalRef }">
				<slot
					name="actions"
					v-bind="{
						model,
						isModal,
						setModel,
						modalRef,
						dropdownRef,
						invertedTheme: invertedThemeValues,
					}"
				></slot>
			</template>
		</Modal>
	</BaseWrapper>
</template>

<script setup lang="ts">
	import { computed, ref, watch, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "../base/Wrapper.vue";
	import Modal from "../modal/Simple.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iModalProps, iUseModifiersProps, iUseThemeProps } from "../../types/props";
	import useBrowser from "../../composables/browser";
	import useModifiers from "../../composables/modifiers";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";
	import { eColors } from "@open-xamu-co/ui-common-enums";

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
		el?: vComponent | string;
		/**
		 * Shows/hides the dropdown
		 * @private
		 */
		modelValue?: boolean;
		modalProps?: iModalProps;
		/** Dropdown el classes */
		classes?: string;
	}

	/**
	 * Dropdown Component
	 *
	 * @component
	 */

	defineOptions({ name: "DropdownSimple", inheritAttrs: false });

	const props = withDefaults(defineProps<iDropdownProps>(), {
		theme: eColors.SECONDARY,
		classes: "flx --flxColumn --flx-start-stretch",
	});
	const emit = defineEmits(["close", "update:model-value"]);

	const { getModifierClasses: GMC } = useHelpers(useUtils);
	const { themeClasses, invertedThemeValues } = useTheme(props, true);
	const { tabletMqRange } = useBrowser();
	const { modifiersClasses } = useModifiers(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	const toggleRef = ref<HTMLElement>();
	const dropdownRef = ref<HTMLElement>();
	const isModal = ref(false);
	const model = ref<boolean>(props.modelValue);
	const dropdownClasses = computed<string[]>(() => {
		const classes = [props.classes];

		if (isModal.value) return classes;

		return [
			...classes,
			...modifiersClasses.value,
			...themeClasses.value,
			...GMC([{ active: props.modelValue }], { prefix: "is" }),
			...GMC([[props.position ?? "bottom"].flat(2).join("-")], {
				modifier: "position",
				divider: "-",
			}),
			"dropdown",
		];
	});

	function setModel(value = !model.value) {
		if (value) return openDropdown();

		closeDropdown();
	}

	function openDropdown() {
		document.addEventListener("click", clickOutside, true);
		model.value = true;
	}

	function closeDropdown() {
		emit("close");
		emit("update:model-value", (model.value = false));
		document.removeEventListener("click", clickOutside, true);
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
		set: setModel,
	});

	// lifecycle
	onMounted(() => {
		watch(
			tabletMqRange,
			(value) => {
				isModal.value = value && props.modelValue !== null;

				if (localModel.value) closeDropdown();
			},
			{ immediate: true }
		);

		if (!router?.currentRoute) return;

		// close on route change
		watch(router.currentRoute, closeDropdown, { immediate: false });
	});
	onBeforeUnmount(closeDropdown);
</script>
