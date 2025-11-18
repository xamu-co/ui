<template>
	<LoaderContent
		ref="wrapperRef"
		:loading="loading"
		content
		class="xamu-slider"
		el="header"
		:theme="theme"
		@mouseover="mouseOnTabs = true"
		@mouseleave="mouseOnTabs = false"
	>
		<div class="flx --flxColumn --flx-stretch-center --gap-10 --width-100">
			<div
				ref="sliderContainerRef"
				:class="{ 'avatarAureo --size-lg': gallery, '--invert': invertGallery }"
				class="--overflow-hidden --width-100 --mY"
			>
				<component
					:is="sliderTag"
					v-show="!loading"
					ref="sliderRef"
					class="flx --flxRow --flx-start-stretch --gap-none --overflow"
				>
					<slot></slot>
				</component>
			</div>
			<ul
				v-if="childCount > 1 && controls"
				class="xamu-slider-controls flx --flxRow --flx-center"
			>
				<li v-if="controls === 'full'">
					<ActionButton
						:aria-label="t('previous')"
						:theme="theme"
						round
						@click.prevent="debouncedTab(true)"
					>
						<IconFa name="arrow-left" />
					</ActionButton>
				</li>
				<li v-for="index in childCount" :key="index">
					<ActionButtonToggle
						:id="`slide-${index}`"
						:active="activeSlide === `slide-${index}`"
						:size="eSizes.XS"
						:theme="theme"
						round
						:title="t('pick')"
						@click.prevent="debouncedTab(false, `slide-${index}`)"
					>
						<span v-if="enumerate" class="--txtSize-sm">{{ index }}</span>
						<template v-else>
							<IconFa name="circle" force-regular />
							<IconFa name="circle" />
						</template>
					</ActionButtonToggle>
				</li>
				<li v-if="controls === 'full'">
					<ActionButton
						:aria-label="t('next')"
						:theme="theme"
						round
						@click.prevent="debouncedTab(false)"
					>
						<IconFa name="arrow-right" />
					</ActionButton>
				</li>
			</ul>
		</div>
	</LoaderContent>
</template>

<script setup lang="ts">
	import { computed, ref, inject, onMounted, onBeforeUnmount, useSlots } from "vue";
	import debounce from "lodash-es/debounce";

	import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
	import { useI18n, useUtils } from "@open-xamu-co/ui-common-helpers";
	import { eSizes } from "@open-xamu-co/ui-common-enums";

	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderContent from "../loader/Content.vue";

	import { useHelpers } from "../../composables/utils";
	import type { iUseThemeProps } from "../../types/props";

	export interface iSliderProps extends iUseThemeProps {
		/**
		 * Show controls
		 */
		controls?: boolean | "full";
		/**
		 * Auto-animate
		 */
		animate?: boolean;
		/**
		 * Transition duration in ms
		 * @values 100 - 1000
		 */
		transitionDuration?: number;
		/**
		 * Interval duration in ms
		 */
		intervalDuration?: number;
		visibleSlides?: number;
		/**
		 * is gallery (border radius)
		 * TODO: allow opening overlay with picture gallery
		 */
		gallery?: boolean;
		/**
		 * Invert gallery
		 * Rotates the gallery 180 degrees
		 */
		invertGallery?: boolean;
		enumerate?: boolean;
	}

	/**
	 * Slider principal.
	 * Cada slot es un slide
	 *
	 * @component
	 * @example
	 * <Slider controls="full">
	 *  <div class="flx --flx-center" style="height: 50px; background: rebeccapurple">Slide #1</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: yellowgreen">Slide #2</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: bisque">Slide #3</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: brown">Slide #4</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: peru">Slide #5</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: salmon">Slide #6</div>
	 *  <div class="flx --flx-center" style="height: 50px; background: teal">Slide #7</div>
	 * </Slider>
	 */

	defineOptions({ name: "SliderSimple", inheritAttrs: true });

	const props = withDefaults(defineProps<iSliderProps>(), {
		controls: true,
		animate: true,
		transitionDuration: 700,
		intervalDuration: 7000,
	});

	const { disableAutoAnimate } = inject<iPluginOptions>("xamu") || {};
	const { t } = useHelpers(useI18n);
	const { isBrowser } = useHelpers(useUtils);

	const loading = ref(true);
	const wrapperRef = ref<HTMLElement>();
	const sliderContainerRef = ref<HTMLElement>();
	const sliderRef = ref<HTMLElement>();
	const running = ref(false);
	const mouseOnTabs = ref(false);
	const sliderInterval = ref();
	const activeSlide = ref(`slide-${1}`);
	const childCount = ref(0);

	const allowAutoAnimate = computed<boolean>(() => {
		return !disableAutoAnimate && props.animate;
	});

	const sliderTag = computed(() => {
		const children = useSlots().default?.() || [];

		return children.length && children[0].type === "li" ? "ul" : "div";
	});

	function prepareTransition() {
		if (!sliderRef.value || !sliderContainerRef.value) throw new Error("Missing containers");

		running.value = true;

		const slides = Array.from(sliderRef.value.children || []) as HTMLElement[];
		const sliderWidth = sliderRef.value.offsetWidth;
		const slideWidth = slides[0].offsetWidth;

		// lock slider size
		sliderContainerRef.value.style.width = `${sliderWidth}px`;

		// the transition needs an starting point
		sliderRef.value.style.transform = "translateX(0)";
		sliderRef.value.style.willChange = "transform";

		return {
			slides,
			sliderWidth,
			slideWidth,
			slider: sliderRef.value,
			sliderContainer: sliderContainerRef.value,
		};
	}

	function clearTransition() {
		if (!sliderRef.value || !sliderContainerRef.value) throw new Error("Missing containers");

		sliderRef.value.style.transition = "none";
		sliderContainerRef.value.style.width = "";
		sliderRef.value.style.left = "0";
		running.value = false;
	}

	const slideForward = (transitionTime: number) =>
		new Promise<boolean>((resolve) => {
			const { slides, slideWidth, slider } = prepareTransition();

			// copy first slide to last position
			slides[slides.length - 1].after(slides[0].cloneNode(true));
			slider.style.transition = `transform ${transitionTime}ms ease`;

			setTimeout(() => {
				// transition
				slider.style.transform = `translateX(-${slideWidth}px)`;

				setTimeout(() => {
					// remove duplicated first slide
					slides[0].remove();

					const firstSlide = slider.children[0] as HTMLElement;

					if (firstSlide.dataset.id) activeSlide.value = firstSlide.dataset.id;

					resolve(true);
				}, transitionTime);
			}, 1);
		});

	const slideBackward = (transitionTime: number) =>
		new Promise<boolean>((resolve) => {
			const { slides, slideWidth, slider } = prepareTransition();

			// fake the position
			slider.style.transform = `translateX(-${slideWidth}px)`;
			// copy last slide to first position
			slides[0].before(slides[slides.length - 1].cloneNode(true));
			slider.style.transition = `transform ${transitionTime}ms ease`;

			setTimeout(() => {
				// transition
				slider.style.transform = "translateX(0)";
				setTimeout(() => {
					// remove duplicated last slide
					slides[slides.length - 1].remove();

					const firstSlide = slider.children[0] as HTMLElement;

					if (firstSlide.dataset.id) activeSlide.value = firstSlide.dataset.id;

					resolve(true);
				}, transitionTime);
			}, 1);
		});

	async function tab(
		sentido: boolean,
		target?: string,
		transitionTime: number = props.transitionDuration
	) {
		if (!sliderRef.value || !sliderContainerRef.value) return;

		const slides = Array.from(sliderRef.value.children || []) as HTMLElement[];

		if (!slides.length || running.value) return;

		if (target) {
			// move to desired target
			const slideIndex = slides.findIndex((slide) => slide.dataset.id === target);

			if (slideIndex < 1) return;

			// back or forwards
			const direction = slideIndex > Math.floor(slides.length / 2);
			const steps = direction ? slides.length - slideIndex : slideIndex;
			const halfTime = transitionTime / steps;

			// move n steps in either direction
			for (const step of Array(steps).fill(() => tab(direction, "", halfTime))) {
				await step();
			}
		} else {
			const slide = await (sentido
				? slideBackward(transitionTime)
				: slideForward(transitionTime));

			// reset everything
			if (slide) return clearTransition();
		}
	}

	/**
	 * Set slider interval
	 */
	function launchInterval() {
		if (!sliderRef.value || !sliderContainerRef.value) return;

		const slides = Array.from(sliderRef.value.children || []) as HTMLElement[];

		if (!slides.length) return;

		childCount.value = slides.length;
		slides.forEach((child, index) => {
			child.dataset.id = `slide-${index + 1}`; // slide id
			child.style.flex = `0 0 ${100 / (props.visibleSlides || 1)}%`; // slide size
		});

		if (!allowAutoAnimate.value || childCount.value <= 1) return;

		// autoplay
		sliderInterval.value = setInterval(() => {
			// TODO: prevent if not in viewport
			if (mouseOnTabs.value) return;

			debouncedTab(false);
		}, props.intervalDuration);
	}

	/**
	 * switch tabs
	 */
	const debouncedTab = debounce(tab);

	// lifecycle
	if (isBrowser) {
		onMounted(() => {
			loading.value = true;
			launchInterval();
			loading.value = false;
		});

		onBeforeUnmount(() => {
			clearInterval(sliderInterval.value);
		});
	}
</script>
