<template>
	<nav class="list">
		<BaseInput
			v-if="title || $slots.header"
			v-slot="{ id: baseId }"
			:type="type || 'checkbox'"
			v-bind="{ id, name, title, checked, theme }"
		>
			<label :for="id || baseId" class="toggle--list" :class="`--txtColor-${themeValues[0]}`">
				<slot name="header">
					<span>{{ title }}</span>
					<IconFa name="angle-down" :size="20" />
				</slot>
			</label>
		</BaseInput>
		<component :is="el || 'ul'" class="list-group" :class="$attrs.class">
			<slot></slot>
		</component>
	</nav>
</template>

<script setup lang="ts">
	import BaseInput from "../base/Input.vue";
	import IconFa from "../icon/Fa.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iUseThemeProps } from "../../types/props";
	import useTheme from "../../composables/theme";

	interface Collapse extends iUseThemeProps {
		/** Input id */
		id?: string;
		/** Input name */
		name?: string;
		/** Input type */
		type?: "checkbox" | "radio";
		title?: string;
		checked?: boolean;
		el?: vComponent | string;
	}

	/**
	 * Collapse component
	 *
	 * Collapses contents leaving only the given title behind
	 *
	 * @component
	 */

	defineOptions({ name: "CollapseSimple", inheritAttrs: false });

	const props = defineProps<Collapse>();

	const { themeValues } = useTheme(props);
</script>
