<!-- eslint-disable vue/no-v-html -->
<template>
	<BaseBox v-bind="$attrs" :disabled="readonly" :theme="theme" input @click="useEditorFocus">
		<!-- Code editor, markdown by default -->
		<div class="flx --flxColumn --flx-start-stretch --gap-5">
			<p class="--txtSize-xs --txtColor-secondary5">
				{{ code || input?.meta?.code || "Markdown" }}
			</p>
			<InputCode
				v-if="!previewCode && !readonly"
				v-model="model"
				v-bind="{
					...omit(props, ['input', 'modelValue']),
					extensions: extensions || input?.meta?.extensions,
					code: !!(code || input?.meta?.code),
					editorTheme,
				}"
				:theme="theme"
				@editor="(e) => (emittedEditor = e)"
			/>
			<div v-else class="txt" v-html="useMarkdown(model)"></div>
		</div>
		<ul v-if="!readonly" class="flx --flxRow --flx-between-center">
			<li>
				<ul class="flx --flxRow --flx-start-center --gap-5">
					<li>
						<ActionButtonToggle
							:disabled="previewCode || !modelValue"
							:tooltip="t('form_editor_bold')"
							tooltip-position="bottom"
							round
							@click="useEditorBoldSelection"
						>
							<IconFa name="bold" />
							<IconFa name="bold" />
						</ActionButtonToggle>
					</li>
					<li>
						<ActionButtonToggle
							:disabled="previewCode || !modelValue"
							:tooltip="t('form_editor_italic')"
							tooltip-position="bottom"
							round
							@click="useEditorItalicSelection"
						>
							<IconFa name="italic" />
							<IconFa name="italic" />
						</ActionButtonToggle>
					</li>
					<li>
						<ActionButtonToggle
							:disabled="previewCode || !modelValue"
							:tooltip="t('form_editor_link')"
							tooltip-position="bottom"
							round
							@click="useEditorLinkSelection"
						>
							<IconFa name="link" />
							<IconFa name="link" />
						</ActionButtonToggle>
					</li>
				</ul>
			</li>
			<li>
				<ul class="flx --flxRow --flx-start-center --gap-5">
					<li>
						<ActionButtonToggle
							v-if="!(code || input?.meta?.code)"
							:disabled="!modelValue"
							:active="previewCode"
							:tooltip="t('form_editor_preview')"
							tooltip-position="bottom"
							round
							@click="() => (previewCode = !previewCode)"
						>
							<IconFa name="eye" />
							<IconFa name="eye" />
						</ActionButtonToggle>
					</li>
					<slot name="submit"></slot>
				</ul>
			</li>
		</ul>
	</BaseBox>
</template>

<script setup lang="ts">
	import type { Extension } from "@codemirror/state";
	import type { EditorView } from "codemirror";
	import { computed, ref } from "vue";
	import omit from "lodash-es/omit";

	import type { tFormInput } from "@open-xamu-co/ui-common-types";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseBox from "../base/Box.vue";
	import IconFa from "../icon/Fa.vue";
	import InputCode from "../input/Code.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";

	import type { iInputProps, iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";
	import useMarkdown from "../../composables/markdown";

	interface iBoxEditorProps extends iInputProps, iUseThemeProps {
		readonly?: boolean;
		input?: tFormInput;
		modelValue?: string;
		/** Enable code editor extensions */
		code?: string | boolean;
		/** CodeMirror extensions */
		extensions?: Extension[];
		/** Editor theme */
		editorTheme?: Extension;
	}

	defineOptions({ name: "BoxEditor", inheritAttrs: false });

	const emit = defineEmits(["update:model-value"]);
	const props = defineProps<iBoxEditorProps>();

	const Swal = useHelpers(useSwal);
	const { t } = useHelpers(useI18n);

	const emittedEditor = ref<EditorView>();
	const previewCode = ref(false);

	const model = computed({
		get() {
			return props.modelValue || "";
		},
		set(value: string) {
			emit("update:model-value", value);
		},
	});

	function useEditorFocus(event: Event) {
		const target = event.target as HTMLElement;

		// If clicked on box, focus on editor
		if (!target.classList.contains("x-editor")) return;

		emittedEditor.value?.focus();
	}

	function useEditorBoldSelection() {
		emittedEditor.value?.state.selection.ranges.forEach(({ from, to }) => {
			// Omit if selection is empty
			if (from === to) return;

			const text = emittedEditor.value?.state.doc.sliceString(from, to);

			emittedEditor.value?.dispatch({
				changes: [{ from, to, insert: "**" + text + "**" }],
				selection: { anchor: to + 2 },
			});
		});
	}

	function useEditorItalicSelection() {
		emittedEditor.value?.state.selection.ranges.forEach(({ from, to }) => {
			// Omit if selection is empty
			if (from === to) return;

			const text = emittedEditor.value?.state.doc.sliceString(from, to);

			emittedEditor.value?.dispatch({
				changes: [{ from, to, insert: "*" + text + "*" }],
				selection: { anchor: to + 2 },
			});
		});
	}

	/**
	 * Makes a selection link
	 *
	 * @see https://codemirror.net/examples/selection/
	 * @see https://www.codelessgenie.com/blog/sweetalert-prompt-with-two-input-fields/
	 */
	async function useEditorLinkSelection() {
		const [range] = emittedEditor.value?.state.selection.ranges || [];

		// Omit if selection is empty
		if (!range || range.from === range.to) return;

		const text = emittedEditor.value?.state.doc.sliceString(range.from, range.to);

		const { value, isConfirmed } = await Swal.fire({
			title: t("form_editor_link"),
			html: `
				<div class="flx --flxColumn --flx-start --gap-5">
					<p class="--txtSize-sm">${t("form_editor_link_add_url")}</p>
					<div class="--flx flx --flxRow --flx-center --gap-5 --width-100">
						<div class="iTxt">
							<input id="swal-url-input" type="text" placeholder="URL..." autocomplete="on">
							<i aria-hidden="true" class="fa-link fas icon"></i>
						</div>
					</div>
				</div>
			`,
			showConfirmButton: true,
			confirmButtonText: t("form_editor_link_add_url"),
			showCancelButton: true,
			focusConfirm: false, // Prevent auto-focus on confirm button
			preConfirm: () => {
				const input = document.getElementById("swal-url-input") as HTMLInputElement;
				const url = input.value.trim();

				if (!url) return;

				return { url };
			},
			timer: undefined,
		});

		if (!isConfirmed || !value) return;

		emittedEditor.value?.dispatch({
			changes: [{ from: range.from, to: range.to, insert: `[${text}](${value.url})` }],
			selection: { anchor: range.to + value.url.length + 2 },
		});
	}
</script>
