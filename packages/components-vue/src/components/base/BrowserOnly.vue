<template>
	<slot v-if="isBrowser"></slot>
	<slot v-else-if="$slots.fallback" name="fallback"></slot>
</template>
<script setup lang="ts">
	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import { useHelpers } from "../../composables/utils";

	const { isBrowser } = useHelpers(useUtils);
</script>
