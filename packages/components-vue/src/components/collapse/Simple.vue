<template>
	<nav class="list" :class="`--txtColor-${themeValues[0]}`">
		<BaseInput
			v-if="title || $slots.header"
			v-slot="{ id: baseId }"
			:type="type || 'checkbox'"
			v-bind="{ id, name, title, checked, theme }"
			@change="isOpenHandler"
		>
			<label :for="id || baseId" class="toggle--list" :class="headerClasses">
				<slot name="header" v-bind="{ isOpen }">
					<span>{{ title }}</span>
					<IconFa name="angle-down" :size="20" />
				</slot>
			</label>
		</BaseInput>
		<component :is="el || 'ul'" class="list-group" :class="$attrs.class">
			<slot v-bind="{ isOpen }"></slot>
		</component>
	</nav>
</template>

<script setup lang="ts">
	import BaseInput from "../base/Input.vue";
	import IconFa from "../icon/Fa.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iUseThemeProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { ref } from "vue";

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
		headerClasses?: string;
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

	const isOpen = ref(props.checked || false);

	function isOpenHandler(event: Event) {
		const target = event.target as HTMLInputElement;

		isOpen.value = target.checked;
	}
</script>
