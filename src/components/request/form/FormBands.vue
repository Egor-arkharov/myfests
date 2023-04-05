<template>
	<h4 class="form__title">Choose bands</h4>
	<p class="lead">
		Pick up 9 bands
		<span
			>(
			<inline-svg
				:src="require('@/assets/icons/sub.svg')"
				width="30"
				height="30"
			></inline-svg>
			)
		</span>
		and 3 headliners
		<span
			>(
			<inline-svg
				:src="require('@/assets/icons/head.svg')"
				width="30"
				height="30"
			></inline-svg>
			)
		</span>
	</p>

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
							festSubBands.length === maxSubBands &&
							!festSubBands.includes(band)
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

		<div class="form__settings">
			<p
				class="form__text"
				:class="{ full: festHeadliners.length === AMOUNT_HEADLINERS }"
			>
				Headliners ({{ festHeadliners.length + "/" + AMOUNT_HEADLINERS }}):
				{{ festHeadliners.join(", ") }}
			</p>
			<p
				class="form__text"
				:class="{ full: festSubBands.length === maxSubBands }"
			>
				Other bands ({{ festSubBands.length + "/" + maxSubBands }}):
				{{ festSubBands.join(", ") }}
			</p>
			<button
				class="form__button btn btn--form"
				:class="{ added: isChange }"
				type="submit"
				:disabled="
					festHeadliners.length !== maxHeadliners ||
					festSubBands.length < maxSubBands
				"
			>
				{{ getButtonText() }}
			</button>
		</div>
	</form>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import InlineSvg from "vue-inline-svg";
import { onUpdated, watch } from "@vue/runtime-core";
import { AMOUNT_HEADLINERS, AMOUNT_BANDS } from "@/use/utils";

export default {
	emits: ["submit"],
	props: ["genre"],
	setup(props, { emit }) {
		const store = useStore();
		const bandsFromGenre = ref([]);

		const isChange = ref(false);
		const isAdded = ref(false);

		const festSubBands = ref([]);
		const festHeadliners = ref([]);
		const bandEls = ref([]);
		const maxHeadliners = AMOUNT_HEADLINERS;
		const maxSubBands = AMOUNT_BANDS - AMOUNT_HEADLINERS;

		watch(props, () => {
			festSubBands.value = [];
			festHeadliners.value = [];
			bandsFromGenre.value = store.getters.getBandsByGenre(props.genre);

			bandEls.value.forEach((item) =>
				item.classList.remove(
					"hover-sub",
					"hover-head",
					"addedSub",
					"addedHead"
				)
			);
		});

		onUpdated(() => {
			if (
				festHeadliners.value.length !== maxHeadliners ||
				festSubBands.value.length !== maxSubBands
			) {
				isChange.value = false;
			}
		});

		const hoverSub = (bandIdx, isHover) => {
			if (festSubBands.value.length === maxSubBands) {
				return;
			}

			isHover
				? bandEls.value[bandIdx].classList.add("hover-sub")
				: bandEls.value[bandIdx].classList.remove("hover-sub");
		};

		const hoverHead = (bandIdx, isHover) => {
			if (festHeadliners.value.length === AMOUNT_HEADLINERS) {
				return;
			}

			isHover
				? bandEls.value[bandIdx].classList.add("hover-head")
				: bandEls.value[bandIdx].classList.remove("hover-head");
		};

		const submitHead = (evt, bandIdx) => {
			if (festHeadliners.value.includes(evt)) {
				festHeadliners.value = festHeadliners.value.filter(
					(item) => item !== evt
				);
				bandEls.value[bandIdx].classList.remove("addedHead");
			} else {
				festHeadliners.value.push(evt);
				bandEls.value[bandIdx].classList.add("addedHead");
			}
		};

		const submitSub = (evt, bandIdx) => {
			if (festSubBands.value.includes(evt)) {
				festSubBands.value = festSubBands.value.filter((item) => item !== evt);
				bandEls.value[bandIdx].classList.remove("addedSub");
			} else {
				festSubBands.value.push(evt);
				bandEls.value[bandIdx].classList.add("addedSub");
			}
		};

		const submitBands = () => {
			emit("submit", {
				bands: festSubBands.value,
				headliners: festHeadliners.value,
			});

			isChange.value = true;
			isAdded.value = true;
		};

		const getButtonText = () => {
			let btnText = "Add Bands";

			if (isAdded.value) {
				btnText = "Bands Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Bands";
			}

			return btnText;
		};

		return {
			bandsFromGenre,
			isChange,
			getButtonText,
			festSubBands,
			festHeadliners,
			AMOUNT_HEADLINERS,
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
$this-color: $color-7;

ul {
	margin-bottom: 20px;
}

.lead {
	font-size: 24px;
	margin-bottom: 10px;

	span {
		display: inline-flex;
	}

	svg {
		margin: 0 -5px;
	}
}

.form {
	flex-direction: row;

	&__list {
		display: flex;
		flex-wrap: wrap;
		margin-right: 20px;
	}

	&__settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 200px;
	}

	&__item {
		margin-right: 20px;
		margin-bottom: 20px;
	}

	&__text {
		text-indent: -20px;
		margin-bottom: 10px;

		&.full {
			color: green;
			font-weight: 600;
		}
	}

	&__button {
		margin-top: 30px;
	}
}

.band {
	display: block;
	background-color: transparent;
	border: 2px solid $this-color;
	padding: 15px 45px;
	border-radius: 20px;
	color: $this-color;
	position: relative;
	overflow: hidden;

	font-family: $main-font-bold-ex;

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
			display: block;
			fill: $this-color;
		}

		&-sub {
			left: 0;
			border-right: 2px solid $this-color;
		}

		&-head {
			right: 0;
			border-left: 2px solid $this-color;
		}

		&:hover:not(:disabled) {
			background-color: $this-color;

			svg {
				fill: $white-color;
			}
		}
	}

	&.hover-sub,
	&.addedSub {
		.text {
			display: block;
			transform: translateX(10%);
		}

		.band__button-head {
			display: none;
		}
	}

	&.hover-head,
	&.addedHead {
		.text {
			display: block;
			transform: translateX(-10%);
		}

		.band__button-sub {
			display: none;
		}
	}

	&.addedSub,
	&.addedHead {
		.band__button {
			background-color: $this-color;

			svg {
				fill: $white-color;
			}

			@include hover {
				opacity: 0.7;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.form {
		flex-direction: column;

		&__list {
			margin-right: 0;
		}

		&__settings {
			align-items: flex-start;
			justify-content: flex-start;
			max-width: 100%;
		}

		&__text {
			padding-left: 20px;
		}

		&__button {
			margin-top: 0;
		}
	}

	.lead {
		font-size: 20px;
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.form {
		margin-left: -64px;
		margin-right: -10px;

		&__item {
			margin-right: 10px;
		}

		&__text {
			@include font-s;
		}
	}

	.lead {
		font-size: 16px;
	}

	.band {
		font-size: 14px;
		padding: 10px 35px;

		&__button svg {
			width: 25px;
			height: 100%;
		}
	}
}
</style>
