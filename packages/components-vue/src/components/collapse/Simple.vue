<template>
	<nav class="list">
		<BaseInput
			v-if="title || $slots.header"
			v-slot="{ id }"
			type="checkbox"
			v-bind="{ title, checked, theme }"
		>
			<label :for="id" class="toggle--list" :class="`--txtColor-${themeValues[0]}`">
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
