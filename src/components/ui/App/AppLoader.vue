<template>
	<div class="loader">
		<div class="loader__icons">
			<div
				class="loader__icon"
				v-for="(item, idx) in icons"
				:key="idx"
				:class="item"
			>
				<inline-svg
					:src="require(`@/assets/icons/loader/${item}.svg`)"
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
	height: 500px;

	&__icons {
		position: relative;

		width: 300px;
		height: 300px;

		animation: clockwise $spin-animation;

		@keyframes clockwise {
			from {
				transform: rotate(0turn);
			}
			to {
				transform: rotate(1turn);
			}
		}
	}

	&__icon {
		position: absolute;

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

		animation: counterclockwise $spin-animation;

		@keyframes counterclockwise {
			from {
				transform: rotate(0turn);
			}
			to {
				transform: rotate(-1turn);
			}
		}
	}

	&__text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		@include font-xxl;

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

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.loader {
		height: 450px;

		&__icon svg {
			max-width: 55px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.loader {
		height: 350px;

		&__icons {
			width: 250px;
			height: 250px;
		}

		&__icon svg {
			max-width: 50px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.loader {
		&__icons {
			width: 60%;
			height: 60%;
		}

		&__icon svg {
			max-width: 45px;
		}
	}
}
</style>
