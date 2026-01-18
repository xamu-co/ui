<template>
	<div ref="editorRef" :class="[themeClasses, { '--code': code }, 'iCode']"></div>
</template>

<script setup lang="ts">
	import { type Extension, EditorState } from "@codemirror/state";
	import { markdown } from "@codemirror/lang-markdown";
	import {
		EditorView,
		keymap,
		highlightSpecialChars,
		// drawSelection,
		highlightActiveLine,
		dropCursor,
		rectangularSelection,
		crosshairCursor,
		lineNumbers,
		highlightActiveLineGutter,
		placeholder as usePlaceholder,
	} from "@codemirror/view";
	import {
		defaultHighlightStyle,
		syntaxHighlighting,
		indentOnInput,
		bracketMatching,
		foldGutter,
		foldKeymap,
	} from "@codemirror/language";
	import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
	import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
	import {
		autocompletion,
		completionKeymap,
		closeBrackets,
		closeBracketsKeymap,
	} from "@codemirror/autocomplete";
	import { lintKeymap } from "@codemirror/lint";
	import { materialLight } from "@fsegurai/codemirror-theme-material-light";
	import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";

	import type { iVuePluginOptions } from "../../types/plugin";
	import type { iUseThemeProps, iInputProps } from "../../types/props";
	import useTheme from "../../composables/theme";

	interface iInputCodeProps extends iInputProps, iUseThemeProps {
		/**
		 * Enable code editing extensions
		 */
		code?: boolean;
		/**
		 * Custom extensions
		 * Add extensions for specific languages here
		 */
		extensions?: Extension[];
		/**
		 * Editor theme
		 *
		 * @default @fsegurai/codemirror-theme-material-light
		 *
		 * TODO: Workaround JSS to support layers with custom theme
		 * Codemirror uses JSS for theming
		 */
		editorTheme?: Extension;
		/**
		 * @private
		 */
		modelValue?: string;
	}

	/**
	 * Code editor component
	 * Powered by CodeMirror
	 */

	const emit = defineEmits(["update:model-value", "editor"]);
	const props = withDefaults(defineProps<iInputCodeProps>(), {
		extensions: () => [markdown()],
		editorTheme: () => {
			const { internals = {} } = inject<iVuePluginOptions>("xamu") || {};

			return internals.editorTheme || materialLight;
		},
	});

	const { themeClasses } = useTheme(props);

	const editorRef = ref<HTMLDivElement>();
	const editor = ref<EditorView>();

	const defaultExtensions = computed<Extension[]>(() => [
		// Replace non-printable characters with placeholders
		highlightSpecialChars(),
		// The undo history
		history(),
		// Show a drop cursor when dragging over the editor
		dropCursor(),
		// Allow multiple cursors/selections
		EditorState.allowMultipleSelections.of(true),
		// Re-indent lines when typing specific input
		indentOnInput(),
		// Highlight syntax with a default style
		syntaxHighlighting(defaultHighlightStyle),
		// Automatically close brackets
		closeBrackets(),
		// Load the autocompletion system
		autocompletion(),
		// Allow alt-drag to select rectangular regions
		rectangularSelection(),
		// Change the cursor to a crosshair when holding alt
		crosshairCursor(),
		// Highlight text that matches the selected text
		highlightSelectionMatches(),
		keymap.of([
			// Closed-brackets aware backspace
			...closeBracketsKeymap,
			// A large set of basic bindings
			...defaultKeymap,
			// Search-related keys
			...searchKeymap,
			// Redo/undo keys
			...historyKeymap,
			// Code folding bindings
			...foldKeymap,
			// Autocompletion keys
			...completionKeymap,
			// Keys related to the linter system
			...lintKeymap,
		]),
		props.editorTheme,
		// Listen to document changes
		EditorView.updateListener.of((update) => {
			if (!update.docChanged) return;

			emit("update:model-value", update.state.doc.toString());
		}),
	]);
	/**
	 * Extension by lang
	 */
	const setupExtensions = computed<Extension[]>(() => {
		const newExtensions: Extension[] = [...defaultExtensions.value, ...props.extensions];

		// Placeholder
		if (props.placeholder) {
			newExtensions.push(usePlaceholder(props.placeholder));
		}

		// Code only extensions
		if (props.code) {
			newExtensions.push(
				// A line number gutter
				lineNumbers(),
				// A gutter with code folding markers
				foldGutter(),
				// Replace native cursor/selection with our own
				// drawSelection(),
				// Highlight matching brackets near cursor
				bracketMatching(),
				// Style the current line specially
				highlightActiveLine(),
				// Style the gutter for current line specially
				highlightActiveLineGutter()
			);
		} else {
			newExtensions.push(EditorView.lineWrapping);
		}

		return newExtensions;
	});

	// lifecycle
	watch(
		() => props.modelValue,
		(newValue) => {
			// Bypass if the value is the same (to prevent infinite loop)
			if (newValue === editor.value?.state.doc.toString()) return;

			// Update the whole document
			editor.value?.dispatch({
				changes: {
					from: 0,
					to: editor.value?.state.doc.length,
					insert: props.modelValue,
				},
			});
		},
		{ immediate: false }
	);
	onMounted(() => {
		editor.value = new EditorView({
			doc: props.modelValue, // Set the initial document
			parent: editorRef.value,
			extensions: setupExtensions.value,
		});

		emit("editor", editor.value);
	});
	onBeforeUnmount(() => {
		editor.value?.destroy();
	});
</script>
