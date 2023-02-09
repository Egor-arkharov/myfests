<template>
	<div class="loader">
		<div class="loader__icons">
			<div class="loader__icon" v-for="(item, idx) in icons" :key="idx">
				<inline-svg
					:src="require(`@/assets/icons/${item}.svg`)"
					:class="item"
					width="65"
					height="65"
				></inline-svg>
			</div>
		</div>
		<p class="loader__text">Loading</p>
	</div>
</template>

<script>
import InlineSvg from "vue-inline-svg";

export default {
	setup() {
		const icons = ["guitar", "dj", "mic", "drums", "keytar"];

		return {
			icons,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
$spin-animation: 5s infinite linear;
.loader {
	display: flex;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 100%;
	height: 400px;

	&__icons {
		position: relative;

		width: 300px;
		height: 300px;
	}

	&__icon {
		position: absolute;
		width: 100%;
		height: 100%;
		animation: clockwise $spin-animation;

		@keyframes clockwise {
			from {
				transform: rotate(0turn);
			}
			to {
				transform: rotate(1turn);
			}
		}

		svg {
			position: absolute;
			animation: counterclockwise $spin-animation;

			&.guitar {
				top: -15%;
				left: 50%;
				transform: translateX(-50%);
			}

			&.dj {
				top: 25%;
				right: 0;
				transform: translateX(50%);
			}

			&.keytar {
				top: 25%;
				left: 0;
				transform: translateX(-50%);
			}

			&.mic {
				top: 80%;
				right: 0;
			}

			&.drums {
				top: 80%;
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
	}

	&__text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 24px;
		font-weight: 900;

		animation: text 1s infinite ease-in-out alternate;

		@keyframes text {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
}
</style>
