<template>
	<!-- Wrapper allows for the relative positioning of the dropdown -->
	<BaseWrapper :wrap="!!$slots.toggle" :wrapper="el" :class="$attrs.class">
		<ModalSimple
			v-model="localModel"
			v-bind="{ ...modalProps, theme, invertTheme, disabled: !isModal }"
		>
			<template v-if="$slots.toggle" #toggle="{ modalRef }">
				<div
					ref="toggleRef"
					class="only--active toggle--dropdown"
					:class="{ 'is--active': localModel }"
					:aria-expanded="localModel"
					aria-haspopup="true"
				>
					<slot
						name="toggle"
						v-bind="{ model, setModel, isModal, modalRef, toggleRef, dropdownRef }"
					></slot>
				</div>
			</template>
			<template #default="{ modalRef }">
				<div ref="dropdownRef" :class="dropdownClasses">
					<slot
						v-bind="{
							model,
							isModal,
							setModel,
							modalRef,
							toggleRef,
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
		</ModalSimple>
	</BaseWrapper>
</template>

<script setup lang="ts">
	import { computed, ref, watch, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import BaseWrapper from "../base/Wrapper.vue";
	import ModalSimple from "../modal/Simple.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iModalProps, iUseModifiersProps, iUseThemeProps } from "../../types/props";
	import useBrowser from "../../composables/browser";
	import useModifiers from "../../composables/modifiers";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

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
		/**
		 * Breakpoint range. When to switch to a modal
		 * @default tabletMqRange (md)
		 */
		responsiveRange?: boolean;
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
		responsiveRange: undefined,
	});
	const emit = defineEmits<{
		(e: "update:model-value", value: boolean): any;
		(e: "close"): any;
	}>();

	const { getModifierClasses: GMC } = useHelpers(useUtils);
	const { themeClasses, invertedThemeValues } = useTheme(props, true);
	const { tabletMqRange } = useBrowser();
	const { modifiersClasses } = useModifiers(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	const toggleRef = ref<HTMLElement>();
	const dropdownRef = ref<HTMLElement>();
	const isModal = ref(false);
	const model = ref<boolean>(!!props.modelValue);
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
		// Avoid unnecessary updates
		if (!!value === !!model.value) return;

		if (value) {
			document.addEventListener("click", clickOutside, true);
			document.addEventListener("keydown", handleKeydown, true);
			model.value = true;

			return;
		}

		emit("close");
		emit("update:model-value", (model.value = false));
		document.removeEventListener("click", clickOutside, true);
		document.removeEventListener("keydown", handleKeydown, true);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") setModel(false);
	}

	function clickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const toggle = toggleRef.value;
		const dropdown = dropdownRef.value;

		if (dropdown === target || dropdown?.contains(target) || toggle?.contains(target)) return;

		setModel(false);
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
			() => props.responsiveRange ?? tabletMqRange.value,
			(value) => {
				isModal.value = value && props.modelValue !== null;

				if (localModel.value) setModel(false);
			},
			{ immediate: true }
		);

		if (!router?.currentRoute) return;

		// close on route change
		watch(router.currentRoute, () => setModel(false), { immediate: false });
	});
	onBeforeUnmount(() => setModel(false));
</script>
