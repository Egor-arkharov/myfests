<template>
	<div class="decor" ref="decorRef">
		<div
			v-for="(item, index) in items"
			:key="index"
			class="decor__item"
			ref="itemRefs"
			@click="startAnimation(index)"
			v-html="item"
		></div>
		<div class="decor__logo">
			<inline-svg
				:src="require('@/assets/icons/logo.svg')"
				width="252"
				height="76"
			></inline-svg>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import InlineSvg from "vue-inline-svg";

export default {
	setup() {
		const decorRef = ref(null);
		const itemRefs = ref([]);

		const items = [
			"Have<br>password",
			"Don't have<br>password",
			"Don't want<br>password",
		];

		onMounted(() => {
			const blocks = itemRefs.value;

			blocks[0].addEventListener("animationend", () => {
				decorRef.value.classList.add("animated");
			});
		});

		const startAnimation = () => {
			console.log("Когда-нибудь здесь что-нибудь будет))");
		};

		return { decorRef, itemRefs, items, startAnimation };
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
$spin-animation: 100s infinite;

.decor {
	--animation: false;
	--_w: 45vw;

	width: var(--_w);
	height: var(--_w);

	position: fixed;
	top: 50%;
	left: 50%;
	translate: -50% -50%;

	border-radius: 50%;
	// border: 5px solid $white-color;

	&.animated {
		animation: clockwise $spin-animation;

		&:has(.decor__item:hover) {
			animation-play-state: paused;

			.decor__item,
			.decor__logo {
				animation-play-state: paused;
			}
		}

		.decor__item {
			translate: 0 0;
			animation: counterclockwise $spin-animation;

			@include hover {
				scale: 1.1;
			}
		}

		.decor__logo {
			animation: counterclockwise $spin-animation;
		}
	}

	&__item {
		--_sz: 30%;

		--_r: calc((var(--_w) - var(--_sz)) / 2);
		--_x: calc(var(--_r) + (var(--_r) * cos(var(--_d))));
		--_y: calc(var(--_r) + (var(--_r) * sin(var(--_d))));

		width: var(--_sz);
		height: var(--_sz);

		position: absolute;
		top: var(--_y);
		left: var(--_x);

		border-radius: 50%;
		border: 5px solid rgba($white-color, 0.35);

		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		font-size: calc(12px + 1.2vw);
		color: $white-color;
		font-weight: 900;
		// text-wrap: nowrap;

		transition: scale 0.5s;
		cursor: pointer;
		background: radial-gradient(
			circle,
			rgba($white-color, 0) 0,
			rgba($white-color, 1) 200%
		);

		&:nth-child(1) {
			--_d: -90deg;
			translate: -50vw -10vh;
		}

		&:nth-child(2) {
			--_d: 30deg;
			translate: -50vw 40vh;
		}

		&:nth-child(3) {
			--_d: 150deg;
			translate: 40vw -80vh;
		}

		animation: slide 5s forwards;
	}

	&__logo {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;

		display: flex;
	}

	@keyframes slide {
		to {
			translate: 0 0;
		}
	}

	@keyframes clockwise {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}

	@keyframes counterclockwise {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(-1turn);
		}
	}
}
</style>
