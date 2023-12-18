<template>
	<span class="flx --flxColumn --flx-center">
		<span>
			<span
				:class="`--bgColor-${themeValues[0]}`"
				class="a-pulse is--animated --iterations-infinite"
				:style="loaderStyle"
			></span>
			<span
				:class="`--bgColor-${themeValues[0]}`"
				class="a-pulse is--animated --iterations-infinite --delay-2"
				:style="loaderStyle"
			></span>
			<span
				:class="`--bgColor-${themeValues[0]}`"
				class="a-pulse is--animated --iterations-infinite --delay-4"
				:style="loaderStyle"
			></span>
		</span>
		<slot>
			<span v-if="label" class="txt --txtAlign-center">
				<p>{{ label }}</p>
			</span>
		</slot>
	</span>
</template>

<script setup lang="ts">
	import { reactive, computed } from "vue";

	import type { iUseThemeProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import type { CSSProperties } from "vue";

	interface iLoaderSimpleProps extends iUseThemeProps {
		label?: string;
		size?: string;
		margin?: string;
		radius?: string;
		/**
		 * Animation speed in ms
		 */
		speed?: number;
	}

	/**
	 * Loader
	 * Displays a loader
	 *
	 * @see https://www.npmjs.com/package/vue-spinner
	 * The original one didn't allow to change the animation speed and it was too fast
	 */

	defineOptions({ name: "LoaderSimple", inheritAttrs: true });

	const props = defineProps<iLoaderSimpleProps>();

	const { themeValues } = useTheme(props);

	const size = computed(() => props.size || "0.5rem");
	const loaderStyle = reactive<CSSProperties>({
		width: size.value,
		height: size.value,
		margin: props.margin || "2px",
		borderRadius: props.radius || "100%",
		display: "inline-block",
		animationDuration: (props.speed || 1000) + "ms",
	});
</script>
