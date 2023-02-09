<template>
	<h4 class="title__form">Choose bands</h4>
	<form @submit.prevent="submitBands" class="form">
		<ul class="form__list">
			<li class="form__item" v-for="(band, idx) in bandsFromGenre" :key="idx">
				<div
					class="form__band band"
					:ref="
						(el) => {
							bandEls[idx] = el;
						}
					"
				>
					<span class="text">{{ band }}</span>
					<button
						type="button"
						class="btn band__button band__button-sub"
						@mouseover="hoverSub(idx, true)"
						@mouseleave="hoverSub(idx, false)"
						@click="submitSub(band, idx)"
						:disabled="
							festBands.length === maxSubBands && !festBands.includes(band)
						"
					>
						<inline-svg
							:src="require('@/assets/icons/sub.svg')"
							width="30"
							height="30"
							aria-label="Pick sub"
						></inline-svg>
					</button>
					<button
						type="button"
						class="btn band__button band__button-head"
						@mouseover="hoverHead(idx, true)"
						@mouseleave="hoverHead(idx, false)"
						@click="submitHead(band, idx)"
						:disabled="
							festHeadliners.length === maxHeadliners &&
							!festHeadliners.includes(band)
						"
					>
						<inline-svg
							:src="require('@/assets/icons/head.svg')"
							width="30"
							height="30"
							aria-label="Pick Head"
						></inline-svg>
					</button>
				</div>
			</li>
		</ul>

		<p>Headliners: {{ festHeadliners.join(", ") }}</p>
		<p>Other bands: {{ festBands.join(", ") }}</p>

		<button
			class="form__button btn btn--form"
			type="submit"
			:disabled="
				festHeadliners.length !== maxHeadliners ||
				festBands.length < maxSubBands
			"
		>
			Add bands
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import InlineSvg from "vue-inline-svg";
import { watch } from "@vue/runtime-core";
import { AMOUNT_HEADLINERS, AMOUNT_BANDS } from "@/use/utils";

export default {
	emits: ["submit"],
	props: ["bandsFromGenre"],
	setup(props, { emit }) {
		const festBands = ref([]);
		const festHeadliners = ref([]);
		const bandEls = ref([]);
		const maxHeadliners = AMOUNT_HEADLINERS;
		const maxSubBands = AMOUNT_BANDS - AMOUNT_HEADLINERS;

		watch(props, () => {
			festBands.value = [];
			festHeadliners.value = [];
			bandEls.value.forEach((item) =>
				item.classList.remove(
					"activesub",
					"activehead",
					"addedSub",
					"addedHead",
					"added"
				)
			);
		});

		const hoverSub = (bandIdx, isHover) => {
			isHover
				? bandEls.value[bandIdx].classList.add("activesub")
				: bandEls.value[bandIdx].classList.remove("activesub");
		};

		const hoverHead = (bandIdx, isHover) => {
			isHover
				? bandEls.value[bandIdx].classList.add("activehead")
				: bandEls.value[bandIdx].classList.remove("activehead");
		};

		const submitHead = (evt, bandIdx) => {
			if (festHeadliners.value.includes(evt)) {
				festHeadliners.value = festHeadliners.value.filter(
					(item) => item !== evt
				);
				bandEls.value[bandIdx].classList.remove("addedHead", "added");
			} else {
				festHeadliners.value.push(evt);
				bandEls.value[bandIdx].classList.add("addedHead", "added");
			}
		};

		const submitSub = (evt, bandIdx) => {
			if (festBands.value.includes(evt)) {
				festBands.value = festBands.value.filter((item) => item !== evt);
				bandEls.value[bandIdx].classList.remove("addedSub", "added");
			} else {
				festBands.value.push(evt);
				bandEls.value[bandIdx].classList.add("addedSub", "added");
			}
		};

		const submitBands = () => {
			emit("submit", {
				bands: festBands.value,
				headliners: festHeadliners.value,
			});
		};

		return {
			festBands,
			festHeadliners,
			submitBands,
			submitHead,
			submitSub,
			hoverSub,
			hoverHead,
			bandEls,
			maxHeadliners,
			maxSubBands,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style scoped lang="scss">
ul {
	margin-bottom: 20px;
}

.form {
	&__list {
		display: flex;
		flex-wrap: wrap;
	}

	&__item {
		margin-right: 20px;
		margin-bottom: 20px;
	}
}

.band {
	display: block;
	background-color: transparent;
	border: 2px solid $btn-color;
	padding: 15px 45px;
	border-radius: 20px;
	color: $btn-color;
	font-weight: 900;
	position: relative;
	overflow: hidden;

	&__button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 100%;
		transition: right 1s, left 1s;

		span {
			position: absolute;
			left: 100%;
		}

		svg {
			fill: $btn-color;
		}

		&-sub {
			left: 0;
			border-right: 2px solid $btn-color;
		}

		&-head {
			right: 0;
			border-left: 2px solid $btn-color;
		}

		&:hover {
			background-color: $btn-color;

			svg {
				fill: white;
			}
		}
	}

	&.activesub,
	&.addedSub {
		.text {
			display: block;
			transform: translateX(10%);
		}

		.band__button-head {
			display: none;
		}
	}

	&.activehead,
	&.addedHead {
		.text {
			display: block;
			transform: translateX(-10%);
		}

		.band__button-sub {
			display: none;
		}
	}

	&.added .band__button {
		background-color: $btn-color;

		svg {
			fill: white;
		}

		&:hover {
			background-color: white;

			svg {
				fill: $btn-color;
			}
		}
	}
}
</style>
