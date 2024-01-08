<template>
	<slot v-if="$slots.toggle" name="toggle" v-bind="{ toggleModal, model }"></slot>
	<Teleport v-if="!disabled" :id="randomId" :key="randomId" :to="target || 'body'">
		<dialog ref="modalRef" @close="closeAndResetModal" @mousedown="clickOutside">
			<div
				v-show="!loading && !hide"
				class="modal"
				role="document"
				:class="[
					modalClass ?? 'flx --flxColumn --flx-start-stretch --width',
					`--bgColor-${themeValues[1]}`,
				]"
				v-bind="$attrs"
			>
				<slot name="modal-header" v-bind="{ toggleModal, model }">
					<div v-if="title" class="flx --flxRow --flx-between-center">
						<div class="txt --gaping-none">
							<h5>{{ title }}</h5>
							<p v-if="subtitle" class="--txtSize-xs">{{ subtitle }}</p>
						</div>
						<ActionLink
							:theme="theme"
							:aria-label="cancelButtonOptions.title"
							@click.stop="closeAndResetModal"
						>
							<IconFa name="xmark" size="20" />
						</ActionLink>
					</div>
				</slot>
				<div class="scroll --vertical"><slot v-bind="{ toggleModal, model }"></slot></div>
				<slot name="modal-footer" v-bind="{ toggleModal, model }">
					<div v-if="!hideFooter" class="flx --flxRow --flx-end-center">
						<ActionButton
							v-if="saveButtonOptions.visible"
							:theme="theme"
							:aria-label="saveButtonOptions.title"
							:class="saveButtonOptions.btnClass"
							@click="emit('save', closeAndResetModal, $event)"
						>
							{{ saveButtonOptions.title }}
						</ActionButton>
						<ActionButtonToggle
							v-if="cancelButtonOptions.visible"
							:theme="theme"
							:aria-label="cancelButtonOptions.title"
							:class="cancelButtonOptions.btnClass"
							data-dismiss="modal"
							round=":sm-inv"
							@click.stop="closeAndResetModal"
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
			<LoaderSimple v-if="loading || hide" :theme="theme">
				<transition name="fade">
					<div
						v-if="loadingTooLong || (props.hide && props.hideMessage)"
						class="txt --txtAlignFlx-center --gaping-5"
					>
						<p class="--txtColor-light --txtShadow --txtSize-sm">
							{{ props.hideMessage ? props.hideMessage : t("modal_taking_too_long") }}
						</p>
						<ActionButton
							:theme="theme"
							:aria-label="t('close')"
							@click="closeAndResetModal"
						>
							{{ t("close") }}
						</ActionButton>
					</div>
				</transition>
			</LoaderSimple>
		</dialog>
	</Teleport>
	<slot v-else v-bind="{ toggleModal, model }"></slot>
</template>

<script setup lang="ts">
	import { type RendererElement, computed, onMounted, onUnmounted, ref, watch } from "vue";

	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

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
	const { themeValues } = useTheme(props);
	const { uuid } = useUUID();

	const resolver = ref<(r?: boolean) => void>();
	const randomId = uuid().replace("-", "").substring(0, 8);
	const localModel = ref<boolean>();
	const modalRef = ref<HTMLDialogElement>();
	/** Are the requirements for the modal are taking longer than usual? */
	const loadingTooLong = ref(false);
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

	function closeAndResetModal() {
		modalRef.value?.close();
		loadingTooLong.value = false;
		emit("update:model-value", false);
		emit("close");
	}
	function clickOutside(e: Event) {
		if (modalRef.value !== e.target) return;

		closeAndResetModal();
	}
	/**
	 * Toggles modal
	 * @param success whether the modal action was successfull or not
	 */
	function toggleModal(success?: boolean) {
		return new Promise<boolean | undefined>((resolve) => {
			if (model.value) {
				// old promise
				resolver.value?.(success);
				// current promise
				resolve(success);
			} else resolver.value = resolve;

			model.value = !model.value;
		});
	}

	/**
	 * Modal model
	 */
	const model = computed({
		get() {
			return !props.disabled && localModel.value;
		},
		set(value) {
			if (!value) closeAndResetModal();
			else {
				modalRef.value?.showModal();

				// close modal if requirements are not meet
				if (!props.loading && props.hide) {
					value = false;
					closeAndResetModal();
					Swal.fire({
						title: t("swal.modal_unauthorized"),
						text: props.hideMessage || t("swal.modal_unauthorized_text"),
						icon: "warning",
					});
				}

				// display message if loading longer than usual
				setTimeout(() => (loadingTooLong.value = props.loading), 3000);
			}

			localModel.value = value;
		},
	});

	// lifecycle
	onMounted(() => {
		if (props.modelValue) model.value = props.modelValue;
	});
	onUnmounted(closeAndResetModal);
	watch(
		() => props.modelValue,
		(show) => (model.value = show),
		{ immediate: false }
	);
</script>
