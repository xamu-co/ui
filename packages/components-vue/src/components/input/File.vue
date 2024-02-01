<template>
	<div
		:class="[classes, modifiersClasses, stateClasses, fileInputTheme.themeClasses]"
		class="box --button flx --flxColumn --flx-start-stretch --gap-10 --width"
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
						class="avatar --index --bdr"
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
						count: modelValue.length,
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
				..._.omit(props, 'modelValue'),
				type: 'file',
				accept: (accept ?? ['image/*']).join(','),
				multiple: maxAmount > 1,
				disabled,
			}"
			@change="handleInputChange"
		>
			<template v-if="!isLoading">
				<label
					v-if="modelValue.length < maxAmount"
					:for="id"
					:class="[...fileInputTheme.themeClasses, { '--bgColor-none': !isDragover }]"
					class="box --bdr-dashed --size-xs flx --flxColumn --flx-center --minHeight-90"
					@drag="prevent"
					@dragstart="prevent"
					@dragend="handleMouseOut"
					@dragleave="handleMouseOut"
					@drop="handleFileDrop"
					@dragover="handleMouseOver"
					@dragenter="handleMouseOver"
				>
					<div class="txt --txtAlignFlx-center">
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
				</label>
				<div
					v-else
					:class="fileInputTheme.themeClasses"
					class="box --bdr-solid --size-xs --bgColor-none flx --flxRow --flx-center"
				>
					<p>{{ t("file_completed") }}</p>
					<ActionButton
						:theme="fileInputTheme.themeValues"
						:aria-label="t('file_delete_files', maxAmount)"
						@click.prevent="setFiles()"
					>
						{{ t("file_delete_files", maxAmount) }}
					</ActionButton>
				</div>
			</template>
			<div
				v-else
				:class="fileInputTheme.themeClasses"
				class="box --bdr-solid --size-xs --bgColor-none flx --flxRow --flx-center"
			>
				{{ t("file_loading_files", maxAmount) }}
			</div>
		</BaseInput>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import _ from "lodash";

	import type { tProps } from "@open-xamu-co/ui-common-types";
	import { eColors } from "@open-xamu-co/ui-common-enums";
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
	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionLink from "../action/Link.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

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
		/**
		 * Content clasess
		 */
		classes?: tProps<string>;
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
	const { isBrowser } = useHelpers(useUtils);
	const Swal = useHelpers(useSwal);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const validTheme = useTheme(props);
	const invalidTheme = useTheme({ theme: eColors.DANGER });

	const fileInputTheme = computed(() => {
		const invalid = props.invalid;

		return {
			themeClasses: invalid ? invalidTheme.themeClasses.value : validTheme.themeClasses.value,
			themeValues: invalid ? invalidTheme.themeValues.value : validTheme.themeValues.value,
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
	async function storeFiles(files: FileList) {
		isLoading.value = true;

		// copy the files
		const savedFiles = [...props.modelValue];
		const savedThumbs = [...thumbnails.value];

		try {
			for (let i = 0; i < files.length; i++) {
				// omit if max file reached
				if (savedFiles.length >= maxAmount.value) {
					Swal.fire({
						title: t("swal.file_limit"),
						text: t("swal.file_limit_text", {
							count: maxAmount.value,
							amount: maxAmount.value,
						}),
						icon: "warning",
					});

					break;
				}

				// TODO: Allow for multiple file types
				// validate file "mime type"
				const isImage = await fileMatchesMimeTypes(files[i], standardImageMimeTypes);

				// 50MB max file size
				if (isImage) {
					// is image file
					if (files[i].size < maxFileSize.value) {
						const fileName = `${props.filePrefix ?? "image"}_${i}`;

						savedFiles.push(renameFile(files[i], fileName));
						savedThumbs.push(await getBase64FromImageFile(files[i]));
					} else {
						// file too big
						Swal.fire({
							title: t("swal.file_too_big"),
							text: t("swal.file_too_big_text"),
							icon: "warning",
						});
					}
				} else {
					// not image
					Swal.fire({
						title: t("swal.file_wrong_format_image"),
						text: t("swal.file_wrong_format_image_text"),
						icon: "warning",
					});
				}
			}

			// last one, save all.
			setFiles(savedFiles, savedThumbs);
		} catch (error) {
			console.log(error);

			Swal.fire({
				title: t("swal.file_unknown_error"),
				text: t("swal.file_unknown_error_text"),
				icon: "error",
				timer: undefined,
				showConfirmButton: true,
			});
		}

		isLoading.value = false;
	}

	/**
	 * remove the given file in the given key
	 */
	const removeFile = _.debounce((index: number) => {
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
		storeFiles(dataTransfer?.files || originalEvent.dataTransfer.files);
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
		storeFiles(target.files);
	}

	// lifecycle
	if (isBrowser) isAdvancedUpload.value = checkAdvancedUploadSupport();
</script>
