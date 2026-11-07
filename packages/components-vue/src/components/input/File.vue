<template>
	<BaseBox
		class="flx --flxColumn --flx-start-stretch --gap-10 --width-100"
		button
		v-bind="{ ...props, theme: fileInputTheme.themeValues }"
	>
		<div v-if="thumbnails.length" class="flx --flxRow --flx-start-center --gap-10">
			<ul class="flx --flxRow-wrap --flx-start-center --gap-10">
				<li
					v-for="({ type, source, file }, thumb_index) in thumbnails"
					:key="thumb_index"
					class="flx --flxRow --flx-start-center --gap-5"
				>
					<ActionLink
						:tooltip="
							source
								? t('file_delete_files', 1)
								: t('file_delete_heavy_file', {
										maxSize: Math.round(thumbnailMaxSize / 1024 / 1024),
									})
						"
						tooltip-position="bottom"
						@click.prevent="(e: Event) => removeFile(thumb_index, e)"
					>
						<figure class="avatar --size-sm --index --bdr flx --flxRow --flx-center">
							<div
								class="back flx --flxRow --flx-center"
								@mouseenter="playMedia"
								@mouseleave="pauseMedia"
							>
								<img
									v-if="type == eMimeType.IMAGE && source"
									:src="source"
									:alt="t('file_thumb')"
								/>
								<video
									v-else-if="type == eMimeType.VIDEO && source"
									:src="source"
									:alt="t('file_thumb')"
									loop
								></video>
								<audio
									v-else-if="type == eMimeType.AUDIO && source"
									:src="source"
									:alt="t('file_thumb')"
									loop
								></audio>
								<IconFa v-else :name="getFileIcon(file)" :size="30" />
							</div>
							<ActionLink
								:theme="eColors.LIGHT"
								class="--shadow"
								style="pointer-events: none"
							>
								<IconFa name="xmark" />
							</ActionLink>
						</figure>
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
					<ActionButton
						:theme="fileInputTheme.themeValues"
						round=":sm-inv"
						@click.prevent="setFiles()"
					>
						<IconFa name="xmark" hidden="-full:sm" />
						<span class="--hidden-full:sm-inv">
							{{ t("file_delete_files", maxAmount) }}
						</span>
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
	import { ref, computed, watch, toRaw, onBeforeUnmount } from "vue";
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
		// Documents
		pdfMimeType,
		docMimeType,
		docxMimeType,
		xlsMimeType,
		xlsxMimeType,
		pptMimeType,
		pptxMimeType,
		txtMimeType,
		txtUtf8BomMimeType,
		// Compressed
		zipMimeTypes,
		rarMimeTypes,
	} from "@open-xamu-co/ui-common-helpers";

	import type { IconName } from "@fortawesome/fontawesome-common-types";
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
		/**
		 * Optional prefix for renamed files (e.g. 'avatar' -> 'avatar_0.png').
		 * If omitted, defaults to the matched media type (e.g. 'image_0.png').
		 */
		filePrefix?: string;
		/**
		 * Minimum number of files required.
		 */
		min?: number;
		/**
		 * Maximum number of files allowed.
		 * @default 100
		 */
		max?: number;
		/**
		 * Maximum file size in bytes per file.
		 * @default 10000000 (10 MB)
		 */
		maxSize?: number;
		/**
		 * Accepted file formats, wildcards or MIME types (e.g. ['image/*', 'video/mp4', '.png']).
		 * @default ["image/*"]
		 */
		accept?: string[];
		/**
		 * Capture files directly from camera / microphone.
		 */
		capture?: "environment" | "user";
		/**
		 * Maximum file size in bytes above which no thumbnail is generated.
		 * Conserves browser memory by falling back to generic icon.
		 * @default 104857600 (100 MB)
		 */
		thumbnailMaxSize?: number;
		// PRIVATE
		modelValue: File[];
		/**
		 * Restore old behavior (Extension was omitted from file names)
		 */
		withoutExtension?: boolean;
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
		file?: File;
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
		thumbnailMaxSize: 100 * 1024 * 1024,
	});
	const emit = defineEmits<{ (e: "update:model-value", value: File[]): any }>();

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

		/**
		 * Checks whether the given MIME category, extension, or specific MIME types
		 * match the accepted formats defined in props.accept.
		 *
		 * Supports:
		 * - Global wildcard: '*'
		 * - Category wildcard: `${type}/*` (e.g. 'image/*')
		 * - Extension: `.${extension}` or `${extension}` (e.g. '.png' or 'png')
		 * - Exact MIME types: e.g. 'image/png', 'video/mp4'
		 *
		 * @param type - High-level MIME category enum (e.g. eMimeType.IMAGE)
		 * @param extension - File extension without dot (e.g. 'png', 'jpg')
		 * @param mimeTypes - Specific MIME type strings to match (e.g. 'image/png')
		 */
		function matchAccept(type: eMimeType, extension: string, ...mimeTypes: string[]) {
			const normalizedAccept = props.accept.map((a) => a.trim().toLowerCase());
			const ext = extension.toLowerCase();
			const typeWildcard = `${type.toLowerCase()}/*`;

			return (
				normalizedAccept.includes("*") ||
				normalizedAccept.includes(typeWildcard) ||
				normalizedAccept.includes(`.${ext}`) ||
				normalizedAccept.includes(ext) ||
				mimeTypes.some((mime) => normalizedAccept.includes(mime.toLowerCase()))
			);
		}

		let withImages = false;
		let withVideos = false;
		let withAudios = false;
		let withDocuments = false;
		let withCompressed = false;

		// Image formats
		if (matchAccept(eMimeType.IMAGE, "gif", gifMimeTypeA.mime, gifMimeTypeB.mime)) {
			// Animated gifs
			types.push(gifMimeTypeA, gifMimeTypeB);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "heic", heicMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "heif", heifMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "heics", heicSequenceMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "heifs", heifSequenceMimeType.mime)
		) {
			// Apple image formats
			types.push(heicMimeType, heifMimeType, heicSequenceMimeType, heifSequenceMimeType);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "webp", webpMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "bmp", bmpMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "ico", iconMimeTypeA.mime, iconMimeTypeB.mime)
		) {
			// Non standard formats
			types.push(webpMimeType, bmpMimeType, iconMimeTypeA, iconMimeTypeB);

			withImages = true;
		}
		if (
			matchAccept(eMimeType.IMAGE, "jpg", "image/jpeg", "image/jpg") ||
			matchAccept(eMimeType.IMAGE, "jpeg", jpegMimeType.mime) ||
			matchAccept(eMimeType.IMAGE, "png", pngMimeType.mime)
		) {
			// Standard formats
			types.push(jpegMimeType, pngMimeType);

			withImages = true;
		}

		// Video formats
		if (
			matchAccept(eMimeType.VIDEO, "mp4", mp4MimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "webm", webmMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "ogv") ||
			matchAccept(eMimeType.VIDEO, "ogg", oggMimeType.mime)
		) {
			// Standard web video formats
			types.push(mp4MimeType, webmMimeType, oggMimeType);

			withVideos = true;
		}
		if (
			matchAccept(eMimeType.VIDEO, "mkv", mkvMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "mov", movMimeType.mime)
		) {
			// Modern container formats
			types.push(mkvMimeType, movMimeType);

			withVideos = true;
		}
		if (
			matchAccept(eMimeType.VIDEO, "avi", aviMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "flv", flvMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "wmv", wmvMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "mpeg", mpegMimeType.mime) ||
			matchAccept(eMimeType.VIDEO, "mpg")
		) {
			// Legacy formats
			types.push(aviMimeType, flvMimeType, wmvMimeType, mpegMimeType);

			withVideos = true;
		}
		if (matchAccept(eMimeType.VIDEO, "3gp", threegpMimeType.mime)) {
			// Mobile formats
			types.push(threegpMimeType);

			withVideos = true;
		}

		// Audio formats
		if (
			matchAccept(eMimeType.AUDIO, "mp3", mp3Id3MimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "wav", wavMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "aac", aacMimeType.mime)
		) {
			// Standard audio formats
			types.push(mp3Id3MimeType, mp3SyncMimeType, wavMimeType, aacMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "flac", flacMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "aiff", aiffMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "aif")
		) {
			// Lossless audio formats
			types.push(flacMimeType, aiffMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "m4a", m4aMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "oga") ||
			matchAccept(eMimeType.AUDIO, "ogg", oggAudioMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "weba", webmAudioMimeType.mime)
		) {
			// Modern compressed audio formats
			types.push(m4aMimeType, oggAudioMimeType, webmAudioMimeType);

			withAudios = true;
		}
		if (
			matchAccept(eMimeType.AUDIO, "wma", wmaMimeType.mime) ||
			matchAccept(eMimeType.AUDIO, "mid") ||
			matchAccept(eMimeType.AUDIO, "midi", midiMimeType.mime)
		) {
			// Legacy / specialized formats
			types.push(wmaMimeType, midiMimeType);

			withAudios = true;
		}

		// Document formats
		if (matchAccept(eMimeType.DOCUMENT, "pdf", pdfMimeType.mime)) {
			types.push(pdfMimeType);

			withDocuments = true;
		}
		if (
			matchAccept(eMimeType.DOCUMENT, "doc", docMimeType.mime) ||
			matchAccept(eMimeType.DOCUMENT, "docx", docxMimeType.mime)
		) {
			types.push(docMimeType, docxMimeType);

			withDocuments = true;
		}
		if (
			matchAccept(eMimeType.DOCUMENT, "xls", xlsMimeType.mime) ||
			matchAccept(eMimeType.DOCUMENT, "xlsx", xlsxMimeType.mime)
		) {
			types.push(xlsMimeType, xlsxMimeType);

			withDocuments = true;
		}
		if (
			matchAccept(eMimeType.DOCUMENT, "ppt", pptMimeType.mime) ||
			matchAccept(eMimeType.DOCUMENT, "pptx", pptxMimeType.mime)
		) {
			types.push(pptMimeType, pptxMimeType);

			withDocuments = true;
		}
		if (matchAccept(eMimeType.DOCUMENT, "txt", txtMimeType.mime, "text/*")) {
			types.push(txtUtf8BomMimeType, txtMimeType);

			withDocuments = true;
		}

		// Compressed formats
		if (
			matchAccept(
				eMimeType.COMPRESSED,
				"zip",
				"application/zip",
				"application/x-zip-compressed"
			)
		) {
			types.push(...zipMimeTypes);

			withCompressed = true;
		}
		if (
			matchAccept(
				eMimeType.COMPRESSED,
				"rar",
				"application/vnd.rar",
				"application/x-rar-compressed"
			)
		) {
			types.push(...rarMimeTypes);

			withCompressed = true;
		}

		if (withImages) names.push(eMimeType.IMAGE);
		if (withVideos) names.push(eMimeType.VIDEO);
		if (withAudios) names.push(eMimeType.AUDIO);
		if (withDocuments) names.push(eMimeType.DOCUMENT);
		if (withCompressed) names.push(eMimeType.COMPRESSED);

		return { types, names };
	});

	/**
	 * Determines the appropriate FontAwesome icon based on file extension
	 */
	function getFileIcon(file?: File): IconName {
		if (!file) return "file";

		const ext = file.name.split(".").pop()?.toLowerCase();

		switch (ext) {
			case "pdf":
				return "file-pdf";
			case "doc":
			case "docx":
				return "file-word";
			case "xls":
			case "xlsx":
				return "file-excel";
			case "ppt":
			case "pptx":
				return "file-powerpoint";
			case "txt":
				return "file-lines";
			case "zip":
			case "rar":
				return "file-zipper";
			default:
				return "file";
		}
	}

	function playMedia(e: Event) {
		const media = (e.target as HTMLElement).querySelector("video, audio");

		(media as HTMLMediaElement)?.play?.();
	}

	function pauseMedia(e: Event) {
		const media = (e.target as HTMLElement).querySelector("video, audio");

		(media as HTMLMediaElement)?.pause?.();
	}

	/** Tracks active Object URLs keyed by the raw File reference */
	const objectUrlCache = new Map<File, string>();

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
							const dotIndex = filesArr[i].name.lastIndexOf(".");
							const extension =
								!props.withoutExtension && dotIndex > 0
									? filesArr[i].name.slice(dotIndex)
									: "";
							const fileName = `${props.filePrefix ?? matchMime}_${i}${extension}`;

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
		(newFiles) => {
			const rawNewFiles = newFiles.reduce<File[]>((acc, file) => {
				file = toRaw(file);

				if (file instanceof File) acc.push(file);

				return acc;
			}, []);

			// Revoke Object URLs for files that are no longer in the list
			for (const [cachedFile, url] of objectUrlCache) {
				if (!rawNewFiles.includes(cachedFile)) {
					URL.revokeObjectURL(url);
					objectUrlCache.delete(cachedFile);
				}
			}

			// Build thumbnails, reusing cached URLs for existing files
			thumbnails.value = rawNewFiles.map((file) => {
				const [type] = file.type.split("/");
				const isPreviewable =
					type === eMimeType.IMAGE ||
					type === eMimeType.VIDEO ||
					type === eMimeType.AUDIO;

				// Skip thumbnail for files exceeding the size threshold or non-previewable files
				if (file.size > props.thumbnailMaxSize || !isPreviewable) {
					return { type: type as eMimeType, source: "", file };
				}

				// Reuse existing URL or create a new one
				if (!objectUrlCache.has(file)) {
					objectUrlCache.set(file, URL.createObjectURL(file));
				}

				return {
					type: type as eMimeType,
					source: objectUrlCache.get(file)!,
					file,
				};
			});
		},
		{ immediate: true }
	);

	onBeforeUnmount(() => {
		// Revoke all remaining Object URLs to free browser memory
		for (const url of objectUrlCache.values()) {
			URL.revokeObjectURL(url);
		}

		objectUrlCache.clear();
	});
</script>
