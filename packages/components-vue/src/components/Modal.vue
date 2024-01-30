<template>
	<slot v-if="$slots.toggle" name="toggle" v-bind="{ toggleModal, model }"></slot>
	<BaseWrapper v-if="!disabled" :key="modalId" :el="Teleport" :wrap="!!target" :to="target">
		<dialog :id="modalId" ref="modalRef" @close="closeModal" @mousedown="clickOutside">
			<div
				v-show="!loading && !hide"
				class="modal"
				role="document"
				:class="[modalClass ?? 'flx --flxColumn --flx-start-stretch --width', themeClasses]"
				v-bind="$attrs"
			>
				<slot name="modal-header" v-bind="{ toggleModal, model, invertedTheme }">
					<div v-if="title" class="flx --flxRow --flx-between-center">
						<div class="txt --gaping-none">
							<h5>{{ title }}</h5>
							<p v-if="subtitle" class="--txtSize-xs">{{ subtitle }}</p>
						</div>
						<ActionLink
							:theme="invertedTheme"
							:aria-label="cancelButtonOptions.title"
							@click.stop="closeModal()"
						>
							<IconFa name="xmark" size="20" />
						</ActionLink>
					</div>
				</slot>
				<div class="scroll --vertical">
					<!-- Main modal content -->
					<slot v-bind="{ toggleModal, model, invertedTheme }"></slot>
				</div>
				<slot name="modal-footer" v-bind="{ toggleModal, model, invertedTheme }">
					<div v-if="!hideFooter" class="flx --flxRow --flx-end-center">
						<ActionButton
							v-if="saveButtonOptions.visible"
							:theme="invertedTheme"
							:aria-label="saveButtonOptions.title"
							:class="saveButtonOptions.btnClass"
							@click="emit('save', closeModal, $event)"
						>
							{{ saveButtonOptions.title }}
						</ActionButton>
						<ActionButtonToggle
							v-if="cancelButtonOptions.visible"
							:theme="invertedTheme"
							:aria-label="cancelButtonOptions.title"
							:class="cancelButtonOptions.btnClass"
							data-dismiss="modal"
							round=":sm-inv"
							@click.stop="closeModal()"
						>
							<IconFa name="xmark" hidden="-full:sm" />
							<IconFa name="xmark" regular hidden="-full:sm" />
							<span class="--hidden-full:sm-inv">
								{{ cancelButtonOptions.title }}
							</span>
						</ActionButtonToggle>
					</div>
				</slot>
			</div>
			<LoaderSimple v-if="loading || hide" :theme="invertedTheme">
				<transition name="fade">
					<div
						v-if="loadingTooLong || (props.hide && props.hideMessage)"
						class="txt --txtAlignFlx-center --gaping-5"
					>
						<p class="--txtColor-light --txtShadow --txtSize-sm">
							{{ props.hideMessage ? props.hideMessage : t("modal_taking_too_long") }}
						</p>
						<ActionButton
							:theme="invertedTheme"
							:aria-label="t('close')"
							@click="closeModal()"
						>
							{{ t("close") }}
						</ActionButton>
					</div>
				</transition>
			</LoaderSimple>
		</dialog>
	</BaseWrapper>
	<slot v-else v-bind="{ toggleModal, model, invertedTheme }"></slot>
</template>

<script setup lang="ts">
	import {
		computed,
		onMounted,
		onUnmounted,
		ref,
		watch,
		Teleport,
		type RendererElement,
	} from "vue";
	import _ from "lodash";

	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "./base/Wrapper.vue";
	import IconFa from "./icon/Fa.vue";
	import ActionLink from "./action/Link.vue";
	import ActionButton from "./action/Button.vue";
	import ActionButtonToggle from "./action/ButtonToggle.vue";
	import LoaderSimple from "./loader/Simple.vue";

	import type { iUseThemeProps } from "../types/props";
	import useTheme from "../composables/theme";
	import useUUID from "../composables/uuid";
	import useHelpers from "../composables/helpers";

	interface iButtonConfig {
		title?: string;
		visible?: boolean;
		btnClass?: string;
	}

	interface iModalProps extends iUseThemeProps {
		/**
		 * Modal is loading
		 * Some of the modal contents could be still loading
		 */
		loading?: boolean;
		/**
		 * The title of the modal shown in .x-modal-header div. If empty title is not rendered
		 */
		title?: string;
		subtitle?: string;
		/**
		 * :class object which is attached to the modal modal element
		 */
		modalClass?: string | string[] | Record<string, boolean>;
		/**
		 * Save button config
		 */
		saveButton?: iButtonConfig;
		/**
		 * Cancel button config
		 */
		cancelButton?: iButtonConfig;
		/**
		 * Are modal requirement meet?
		 * This is intended to prevent the usage of certain modals
		 *
		 * Ex: user does not have enough permissions
		 */
		hide?: boolean;
		hideMessage?: string;
		hideFooter?: boolean;
		/**
		 * disables modal
		 */
		disabled?: boolean;
		// PRIVATE
		/**
		 * Shows/hides the modal
		 * @private
		 */
		modelValue?: boolean;
		target?: string | RendererElement;
	}

	/**
	 * Based on @innologica/vue-stackable-modal
	 * Modified to support vue3
	 * It now uses dialog
	 *
	 * @see https://github.com/Innologica/vue-stackable-modal
	 */

	defineOptions({ name: "ModalSimple", inheritAttrs: false });

	const props = defineProps<iModalProps>();
	const emit = defineEmits(["save", "close", "update:model-value"]);

	const { t } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);
	const { themeClasses, invertedTheme } = useTheme(props, true);
	const { uuid } = useUUID();

	const resolver = ref<(r?: boolean) => void>();
	const randomId = uuid().replace("-", "").substring(0, 8);
	const localModel = ref<boolean>();
	const modalRef = ref<HTMLDialogElement>();
	/** Are the requirements for the modal are taking longer than usual? */
	const loadingTooLong = ref(false);
	/** Prefer a predictable identifier */
	const modalId = computed(() => {
		const seed = _.deburr(props.subtitle || props.title);

		return `modal_${seed.replaceAll(" ", "") || randomId}`;
	});
	const saveButtonOptions = computed<iButtonConfig>(() => ({
		title: t("ok"),
		visible: !!props.saveButton?.title,
		btnClass: "",
		...(!!props.saveButton && props.saveButton),
	}));
	const cancelButtonOptions = computed<iButtonConfig>(() => ({
		title: t("close"),
		visible: true,
		btnClass: "",
		...(!!props.cancelButton && props.cancelButton),
	}));

	function closeModal(success?: boolean) {
		modalRef.value?.close();
		loadingTooLong.value = false;
		localModel.value = false;
		resolver.value?.(success); // resolve promise early
		emit("update:model-value", false);
		emit("close");
	}
	function clickOutside(e: Event) {
		if (modalRef.value !== e.target) return;

		closeModal();
	}
	/**
	 * Opens modal if requirements are met
	 */
	function openModal() {
		localModel.value = true;
		modalRef.value?.showModal();

		// close modal if requirements are not meet
		if (!props.loading && props.hide) {
			Swal.fire({
				title: t("swal.modal_unauthorized"),
				text: props.hideMessage || t("swal.modal_unauthorized_text"),
				icon: "warning",
			});

			return closeModal();
		}

		// display message if loading longer than usual
		setTimeout(() => (loadingTooLong.value = props.loading), 3000);
	}
	/**
	 * Toggles modal
	 * @param success whether the modal action was successfull or not
	 */
	function toggleModal(success?: boolean) {
		return new Promise<boolean | undefined>((resolve) => {
			if (model.value) {
				closeModal(success); // close & resolve old promise
				resolve(undefined); // bypass promise
			} else {
				resolver.value = resolve;
				openModal();
			}
		});
	}

	/** Modal model */
	const model = computed(() => !props.disabled && (props.modelValue || localModel.value));

	// lifecycle
	onMounted(() => {
		watch(
			() => props.modelValue,
			(show) => {
				if (show) openModal();
			},
			{ immediate: true }
		);
	});
	onUnmounted(closeModal);
</script>
