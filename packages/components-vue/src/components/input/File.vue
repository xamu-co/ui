<template>
	<BaseBox
		class="flx --flxColumn --flx-start-stretch --gap-10 --width-100"
		button
		v-bind="{ ...props, theme: fileInputTheme.themeValues }"
	>
		<div v-if="thumbnails.length" class="flx --flxRow --flx-start-center --gap-10">
			<ul class="flx --flxRow-wrap --flx-start-center --gap-10">
				<li
					v-for="({ type, source }, thumb_index) in thumbnails"
					:key="thumb_index"
					class="flx --flxRow --flx-start-center --gap-5"
				>
					<ActionLink
						class="avatar --index --bdr flx --flxRow --flx-center"
						:tooltip="t('file_delete_files', 1)"
						tooltip-position="bottom"
						@click.prevent="(e: Event) => removeFile(thumb_index, e)"
					>
						<div
							class="back flx --flxRow --flx-center"
							@mouseenter="playMedia"
							@mouseleave="pauseMedia"
						>
							<img
								v-if="type == eMimeType.IMAGE"
								:src="source"
								:alt="t('file_thumb')"
								@load="() => revokeObjectURL(source)"
							/>
							<video
								v-else-if="type == eMimeType.VIDEO"
								:src="source"
								:alt="t('file_thumb')"
								loop
								@load="() => revokeObjectURL(source)"
							></video>
							<audio
								v-else-if="type == eMimeType.AUDIO"
								:src="source"
								:alt="t('file_thumb')"
								loop
								@load="() => revokeObjectURL(source)"
							></audio>
							<IconFa v-else :name="'file'" :size="50" />
						</div>
						<ActionLink
							:theme="eColors.LIGHT"
							class="--shadow"
							style="pointer-events: none"
						>
							<IconFa name="xmark" :size="20" />
						</ActionLink>
					</ActionLink>
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
		<!-- Do not hide input (Apple issue) -->
		<BaseInput
			v-slot="{ id }"
			class="--hidden"
			v-bind="{
				...$attrs,
				...omit(props, ['modelValue', 'size']),
				type: 'file',
				accept: accept.join(','),
				capture,
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
					<div class="txt --txtAlign-center --txtWrap">
						<template v-if="!isDragover">
							<!-- Show text on desktop -->
							<p class="--hidden-full:md-inv">
								<b>{{ t("file_choose_file", maxAmount) }}</b>
								{{
									(isAdvancedUpload &&
										!isDragover &&
										t("file_or_drop_files_here", maxAmount)) ||
									""
								}}
							</p>
							<!-- Show button on mobile -->
							<ActionButton
								:theme="fileInputTheme.themeValues"
								tag="label"
								:for="id"
								class="--hidden-full:md"
							>
								{{ t("file_choose_file", maxAmount) }}
							</ActionButton>
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
					<ActionButton :theme="fileInputTheme.themeValues" @click.prevent="setFiles()">
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
	import { ref, computed, watch } from "vue";
	import debounce from "lodash-es/debounce";
	import omit from "lodash-es/omit";

	import { eColors, eMimeType, eSizes } from "@open-xamu-co/ui-common-enums";
	import {
		fileMatchesMimeTypes,
		renameFile,
		useUtils,
		useSwal,
		useI18n,
		// Images
		gifMimeTypeA,
		gifMimeTypeB,
		heicMimeType,
		heifMimeType,
		heicSequenceMimeType,
		heifSequenceMimeType,
		webpMimeType,
		bmpMimeType,
		iconMimeTypeA,
		iconMimeTypeB,
		jpegMimeType,
		pngMimeType,
		// Videos
		mp4MimeType,
		webmMimeType,
		oggMimeType,
		mkvMimeType,
		movMimeType,
		aviMimeType,
		flvMimeType,
		wmvMimeType,
		mpegMimeType,
		threegpMimeType,
		// Audios
		mp3Id3MimeType,
		mp3SyncMimeType,
		wavMimeType,
		flacMimeType,
		aacMimeType,
		m4aMimeType,
		oggAudioMimeType,
		webmAudioMimeType,
		wmaMimeType,
		aiffMimeType,
		midiMimeType,
	} from "@open-xamu-co/ui-common-helpers";

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
	import type { iMime } from "@open-xamu-co/ui-common-types";

	interface iInputFileProps
		extends iInputProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {
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
		/**
		 * Capture files directly from camera
		 */
		capture?: "environment" | "user";
		// PRIVATE
		modelValue: File[];
	}

	interface iDropEvent extends DragEvent {
		originalEvent: {
			dataTransfer: DataTransfer;
		};
	}

	interface iThumbnail {
		type: eMimeType;
		/** The playable asset */
		source: string;
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

	const props = withDefaults(defineProps<iInputFileProps>(), {
		accept: () => ["image/*"],
	});
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

	const thumbnails = ref<iThumbnail[]>([]);
	const isAdvancedUpload = ref(false);
	const isLoading = ref(false);
	const isDragover = ref(false);

	const maxAmount = computed(() => props.max ?? 100);
	const maxFileSize = computed(() => props.maxSize ?? 1e7);
	/**
	 * Accept mime types
	 *
	 * All by default
	 * TODO: Allow for multiple file types
	 */
	const acceptMimes = computed(() => {
		const types: iMime[] = [];
		const names: eMimeType[] = [];

		function matchAccept(type: eMimeType, extension: string) {
			return (
				props.accept.includes("*") ||
				props.accept.includes(`${type}/*`) ||
				props.accept.includes(`.${extension}`)
			);
		}

		let withImages = false;
		let withVideos = false;
		let withAudios = false;

		// Image formats
		if (matchAccept(eMimeType.IMAGE, "gif")) {
			// Animated gifs
			types.push(gifMimeTypeA, gifMimeTypeB);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "heic") ||
			matchAccept(eMimeType.IMAGE, "heif") ||
			matchAccept(eMimeType.IMAGE, "heics") ||
			matchAccept(eMimeType.IMAGE, "heifs")
		) {
			// Apple image formats
			types.push(heicMimeType, heifMimeType, heicSequenceMimeType, heifSequenceMimeType);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "webp") ||
			matchAccept(eMimeType.IMAGE, "bmp") ||
			matchAccept(eMimeType.IMAGE, "ico")
		) {
			// Non standard formats
			types.push(webpMimeType, bmpMimeType, iconMimeTypeA, iconMimeTypeB);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "jpg") ||
			matchAccept(eMimeType.IMAGE, "jpeg") ||
			matchAccept(eMimeType.IMAGE, "png")
		) {
			// Standard formats
			types.push(jpegMimeType, pngMimeType);

			withImages = true;
		}

		// Video formats
		if (
			matchAccept(eMimeType.VIDEO, "mp4") ||
			matchAccept(eMimeType.VIDEO, "webm") ||
			matchAccept(eMimeType.VIDEO, "ogv") ||
			matchAccept(eMimeType.VIDEO, "ogg")
		) {
			// Standard web video formats
			types.push(mp4MimeType, webmMimeType, oggMimeType);

			withVideos = true;
		}
		if (matchAccept(eMimeType.VIDEO, "mkv") || matchAccept(eMimeType.VIDEO, "mov")) {
			// Modern container formats
			types.push(mkvMimeType, movMimeType);

			withVideos = true;
		}
		if (
			matchAccept(eMimeType.VIDEO, "avi") ||
			matchAccept(eMimeType.VIDEO, "flv") ||
			matchAccept(eMimeType.VIDEO, "wmv") ||
			matchAccept(eMimeType.VIDEO, "mpeg") ||
			matchAccept(eMimeType.VIDEO, "mpg")
		) {
			// Legacy formats
			types.push(aviMimeType, flvMimeType, wmvMimeType, mpegMimeType);

			withVideos = true;
		}
		if (matchAccept(eMimeType.VIDEO, "3gp")) {
			// Mobile formats
			types.push(threegpMimeType);

			withVideos = true;
		}

		// Audio formats
		if (
			matchAccept(eMimeType.AUDIO, "mp3") ||
			matchAccept(eMimeType.AUDIO, "wav") ||
			matchAccept(eMimeType.AUDIO, "aac")
		) {
			// Standard audio formats
			types.push(mp3Id3MimeType, mp3SyncMimeType, wavMimeType, aacMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "flac") ||
			matchAccept(eMimeType.AUDIO, "aiff") ||
			matchAccept(eMimeType.AUDIO, "aif")
		) {
			// Lossless audio formats
			types.push(flacMimeType, aiffMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "m4a") ||
			matchAccept(eMimeType.AUDIO, "oga") ||
			matchAccept(eMimeType.AUDIO, "ogg") ||
			matchAccept(eMimeType.AUDIO, "weba")
		) {
			// Modern compressed audio formats
			types.push(m4aMimeType, oggAudioMimeType, webmAudioMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "wma") ||
			matchAccept(eMimeType.AUDIO, "mid") ||
			matchAccept(eMimeType.AUDIO, "midi")
		) {
			// Legacy / specialized formats
			types.push(wmaMimeType, midiMimeType);

			withAudios = true;
		}

		if (withImages) names.push(eMimeType.IMAGE);
		if (withVideos) names.push(eMimeType.VIDEO);
		if (withAudios) names.push(eMimeType.AUDIO);

		return { types, names };
	});

	function playMedia(e: Event) {
		const media = (e.target as HTMLElement).querySelector("video, audio");

		(media as HTMLMediaElement)?.play?.();
	}

	function pauseMedia(e: Event) {
		const media = (e.target as HTMLElement).querySelector("video, audio");

		(media as HTMLMediaElement)?.pause?.();
	}

	function revokeObjectURL(src: string) {
		URL.revokeObjectURL(src);
	}

	/**
	 * setFiles
	 */
	function setFiles(files: File[] = [], event?: Event) {
		emit("update:model-value", event ? files : []);
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
	async function storeFiles(files: FileList | File[], event?: Event) {
		isLoading.value = true;

		// copy the files
		const filesArr = Array.from(files); // FileList is unstable
		const savedFiles = [...props.modelValue].filter((v) => v instanceof File);

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
						target: event,
					});

					break;
				}

				if (acceptMimes.value.types.length) {
					// Validate file "mime type"
					const matchMime = await fileMatchesMimeTypes(
						filesArr[i],
						acceptMimes.value.types
					);

					// 50MB max file size
					if (!matchMime) {
						// Not valid mime type
						Swal.fire({
							title: t("swal.file_wrong_format"),
							text: t("swal.file_wrong_format_text", {
								types: acceptMimes.value.names.join(", "),
							}),
							icon: "warning",
							target: event,
						});
					} else {
						// File is valid mime type
						if (filesArr[i].size < maxFileSize.value) {
							const fileName = `${props.filePrefix ?? matchMime}_${i}`;

							savedFiles.push(renameFile(filesArr[i], fileName));
						} else {
							// file too big
							Swal.fire({
								title: t("swal.file_too_big"),
								text: t("swal.file_too_big_text"),
								icon: "warning",
								target: event,
							});
						}
					}
				} else {
					// Unsupported file type
					Swal.fire({
						title: t("swal.file_unsupported_format"),
						text: t("swal.file_unsupported_format_text"),
						icon: "warning",
						target: event,
					});
				}
			}

			// last one, save all.
			setFiles(savedFiles, event);
		} catch (err) {
			logger("InputFile:storeFiles", err);
			Swal.fire({
				title: t("swal.file_unknown_error"),
				text: t("swal.file_unknown_error_text"),
				icon: "error",
				timer: undefined,
				showConfirmButton: true,
				target: event,
			});
		}

		isLoading.value = false;
	}

	/**
	 * remove the given file in the given key
	 */
	const removeFile = debounce((index: number, event?: Event) => {
		// modify and set again
		setFiles(props.modelValue.toSpliced(index, 1), event);
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

	watch(
		() => props.modelValue,
		async (newFiles) => {
			// TODO: optimize thumbnails generation for larger filesets
			thumbnails.value = await Promise.all(
				newFiles.map(async (file) => {
					const [type] = file.type.split("/");

					return {
						type: type as eMimeType,
						source: URL.createObjectURL(file),
					};
				})
			);
		},
		{ immediate: true }
	);
</script>
