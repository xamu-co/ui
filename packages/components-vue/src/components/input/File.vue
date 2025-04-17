<template>
	<BaseBox
		class="flx --flxColumn --flx-start-stretch --gap-10 --width-100"
		button
		v-bind="{ ...props, theme: fileInputTheme.themeValues }"
	>
		<div
			v-if="minAmount !== maxAmount && thumbnails.length"
			class="flx --flxRow --flx-start-center --gap-10"
		>
			<ul class="flx --flxRow-wrap --flx-start-center --gap-10">
				<li
					v-for="(thumb, thumb_index) in thumbnails"
					:key="thumb_index"
					class="flx --flxRow --flx-start-center --gap-5"
				>
					<BaseAction
						class="avatar --index --bdr flx --flx-center"
						:tooltip="t('file_delete_files', 1)"
						tooltip-position="bottom"
						@click.prevent="removeFile(thumb_index)"
					>
						<div class="back">
							<BaseImg :src="thumb" :alt="t('file_thumb')" />
						</div>
						<ActionLink :theme="eColors.LIGHT" class="--shadow">
							<IconFa name="xmark" :size="20" />
						</ActionLink>
					</BaseAction>
				</li>
			</ul>
			<span class="--txtWrap-nowrap">
				{{
					t("file_one_of_amount", {
						count: thumbnails.length,
						amount: maxAmount,
					})
				}}
			</span>
		</div>
		<BaseInput
			v-slot="{ id }"
			ref="fileInput"
			style="display: none"
			v-bind="{
				...$attrs,
				...omit(props, ['modelValue', 'size']),
				type: 'file',
				accept: (accept ?? ['image/*']).join(','),
				multiple: maxAmount > 1,
				disabled,
			}"
			@change="handleInputChange"
		>
			<template v-if="!isLoading">
				<BaseBox
					v-if="thumbnails.length < maxAmount"
					:for="id"
					class="flx --flxColumn --flx-center --minHeight-90"
					el="label"
					dashed
					:size="eSizes.XS"
					:theme="fileInputTheme.themeValues"
					:transparent="!isDragover"
					@drag="prevent"
					@dragstart="prevent"
					@dragend="handleMouseOut"
					@dragleave="handleMouseOut"
					@drop="handleFileDrop"
					@dragover="handleMouseOver"
					@dragenter="handleMouseOver"
				>
					<div class="txt --txtAlign-center">
						<template v-if="!isDragover">
							<p>
								<b>{{ t("file_choose_file", maxAmount) }}</b>
								{{
									(isAdvancedUpload &&
										!isDragover &&
										t("file_or_drop_files_here", maxAmount)) ||
									""
								}}
							</p>
							<p class="--txtSize-xs">
								{{ t("file_max_file_size_mb", { size: maxFileSize / 1e6 }) }}
							</p>
						</template>
						<p v-else>
							<b>{{ t("file_drop_files_here", maxAmount) }}</b>
						</p>
					</div>
				</BaseBox>
				<BaseBox
					v-else
					class="flx --flxRow --flx-center"
					:theme="fileInputTheme.themeValues"
					:size="eSizes.XS"
					solid
					transparent
				>
					<p>{{ t("file_completed") }}</p>
					<ActionButton
						:theme="fileInputTheme.themeValues"
						:aria-label="t('file_delete_files', maxAmount)"
						@click.prevent="setFiles()"
					>
						{{ t("file_delete_files", maxAmount) }}
					</ActionButton>
				</BaseBox>
			</template>
			<BaseBox
				v-else
				class="flx --flxRow --flx-center"
				:theme="fileInputTheme.themeValues"
				:size="eSizes.XS"
				solid
				transparent
			>
				{{ t("file_loading_files", maxAmount) }}
			</BaseBox>
		</BaseInput>
	</BaseBox>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import debounce from "lodash-es/debounce";
	import omit from "lodash-es/omit";

	import { eColors, eSizes } from "@open-xamu-co/ui-common-enums";
	import {
		fileMatchesMimeTypes,
		standardImageMimeTypes,
		renameFile,
		getBase64FromImageFile,
		useUtils,
		useSwal,
		useI18n,
	} from "@open-xamu-co/ui-common-helpers";

	import BaseImg from "../base/Img.vue";
	import BaseAction from "../base/Action.vue";
	import BaseInput from "../base/Input.vue";
	import BaseBox from "../base/Box.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionLink from "../action/Link.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	interface iInputFileProps
		extends iInputProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
		filePrefix?: string;
		min?: number;
		max?: number;
		/**
		 * max file size in bytes
		 */
		maxSize?: number;
		/**
		 * Match files type
		 *
		 * default: all image types
		 */
		accept?: string[];
		// PRIVATE
		modelValue: File[];
	}

	interface iDropEvent extends DragEvent {
		originalEvent: {
			dataTransfer: DataTransfer;
		};
	}

	/**
	 * File Input element
	 * TODO: Support more than images, add dinamyc file types (mapping mimes)
	 *
	 * input value is not required
	 *
	 * @component
	 */

	defineOptions({ name: "InputFile", inheritAttrs: false });

	const props = defineProps<iInputFileProps>();
	const emit = defineEmits(["update:model-value"]);

	const { t } = useHelpers(useI18n);
	const { isBrowser, logger } = useHelpers(useUtils);
	const Swal = useHelpers(useSwal);
	const { themeClasses, dangerThemeClasses, themeValues, dangerThemeValues } = useTheme(props);

	const fileInputTheme = computed(() => {
		const invalid = props.invalid;

		return {
			themeClasses: invalid ? dangerThemeClasses.value : themeClasses.value,
			themeValues: invalid ? dangerThemeValues.value : themeValues.value,
		};
	});

	const fileInput = ref<HTMLInputElement>();
	const thumbnails = ref<string[]>([]);
	const isAdvancedUpload = ref(false);
	const isLoading = ref(false);
	const isDragover = ref(false);
	const minAmount = computed(() => props.min ?? 1);
	const maxAmount = computed(() => props.max ?? 100);
	const maxFileSize = computed(() => props.maxSize ?? 1e7);

	/**
	 * setFiles
	 */
	function setFiles(files: File[] = [], thumbs: string[] = []) {
		thumbnails.value = thumbs;
		emit("update:model-value", files);
	}
	/**
	 * check support for drag and drop
	 */
	function checkAdvancedUploadSupport() {
		const div = document.createElement("div");

		return (
			("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
			"FormData" in window &&
			"FileReader" in window
		);
	}
	/**
	 * stores the files
	 */
	async function storeFiles(files: FileList, target: Event) {
		isLoading.value = true;

		// copy the files
		const filesArr = Array.from(files); // FileList is unstable
		const savedFiles = [...props.modelValue].filter((v) => v instanceof File);
		const savedThumbs = [...thumbnails.value];

		try {
			for (let i = 0; i < filesArr.length; i++) {
				// omit if max file reached
				if (savedFiles.length >= maxAmount.value) {
					Swal.fire({
						title: t("swal.file_limit"),
						text: t("swal.file_limit_text", {
							count: maxAmount.value,
							amount: maxAmount.value,
						}),
						icon: "warning",
						target,
					});

					break;
				}

				// TODO: Allow for multiple file types
				// validate file "mime type"
				const isImage = await fileMatchesMimeTypes(filesArr[i], standardImageMimeTypes);

				// 50MB max file size
				if (!isImage) {
					// not image
					Swal.fire({
						title: t("swal.file_wrong_format_image"),
						text: t("swal.file_wrong_format_image_text"),
						icon: "warning",
						target,
					});
				} else {
					// is image file
					if (filesArr[i].size < maxFileSize.value) {
						const fileName = `${props.filePrefix ?? "image"}_${i}`;

						savedFiles.push(renameFile(filesArr[i], fileName));
						savedThumbs.push(await getBase64FromImageFile(filesArr[i]));
					} else {
						// file too big
						Swal.fire({
							title: t("swal.file_too_big"),
							text: t("swal.file_too_big_text"),
							icon: "warning",
							target,
						});
					}
				}
			}

			// last one, save all.
			setFiles(savedFiles, savedThumbs);
		} catch (err) {
			logger("InputFile:storeFiles", err);
			Swal.fire({
				title: t("swal.file_unknown_error"),
				text: t("swal.file_unknown_error_text"),
				icon: "error",
				timer: undefined,
				showConfirmButton: true,
				target,
			});
		}

		isLoading.value = false;
	}

	/**
	 * remove the given file in the given key
	 */
	const removeFile = debounce((index: number) => {
		// modify and set again
		setFiles(props.modelValue.toSpliced(index, 1), thumbnails.value.toSpliced(index, 1));
	});

	/**
	 * just a prevent
	 *
	 * @listener
	 */
	function prevent(e: Event) {
		if (!isAdvancedUpload.value) return;

		e.preventDefault();
		e.stopPropagation();
	}
	/**
	 * drag event is over
	 *
	 * @listener
	 */
	function handleMouseOver(e: Event) {
		prevent(e);
		isDragover.value = true;
	}
	/**
	 * cursor is out of bounds
	 *
	 * @listener
	 */
	function handleMouseOut(e: Event) {
		prevent(e);
		isDragover.value = false;
	}
	/**
	 * file was droped
	 *
	 * @listener
	 */
	function handleFileDrop(e: Event) {
		const { dataTransfer, originalEvent } = e as iDropEvent;

		handleMouseOut(e);
		storeFiles(dataTransfer?.files || originalEvent.dataTransfer.files, e);
	}
	/**
	 * file was selected from file explorer
	 * process files on explorer search
	 *
	 * @listenerOverride files require specific event handling
	 */
	function handleInputChange(e: Event) {
		const { target } = e as Event & { target: HTMLInputElement };

		if (!target.files) return;

		prevent(e);
		storeFiles(target.files, e);
	}

	// lifecycle
	if (isBrowser) isAdvancedUpload.value = checkAdvancedUploadSupport();
</script>
