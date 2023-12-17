<template>
	<Body class="--minHeight-full flx --flx-center">
		<main id="appex" class="flx --flxColumn --flx-center-start">
			<div class="view">
				<div class="view-item">
					<div class="holder flx --flxColumn --flx-center-start --gap-30">
						<h1 class="--txtColor">Nuxt module playground</h1>
						<div class="txt --gaping-none">
							<p><b>Test your vue components here</b></p>
							<p class="--txtSize-sm --txtColor-dark5">
								Also please remember to not version anything within this playground
							</p>
						</div>
						<XamuActionButtonLink @click="count">{{ text }}</XamuActionButtonLink>
					</div>
				</div>
			</div>
		</main>
	</Body>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	const counter = ref(0);
	const text = ref("This is a button link component");

	function count() {
		counter.value++;

		alert(`You clicked ${counter.value} times`);
	}
</script>

<style>
	#appex {
		min-height: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.view {
		width: 100%;
	}
</style>
