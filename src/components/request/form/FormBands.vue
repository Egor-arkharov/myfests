<template>
	<h4 class="form__title">Choose bands</h4>
	<p class="lead">
		Pick up
		<span class="no-wrap"
			>9 bands&nbsp;
			<span
				>(
				<inline-svg
					:src="require('@/assets/icons/sub.svg')"
					width="30"
					height="30"
				></inline-svg>
				)
			</span></span
		>
		and
		<span class="no-wrap"
			>3 headliners&nbsp;
			<span
				>(
				<inline-svg
					:src="require('@/assets/icons/head.svg')"
					width="30"
					height="30"
				></inline-svg>
				)
			</span></span
		>
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
						@mouseover="hoverBand('sub', idx, true)"
						@mouseleave="hoverBand('sub', idx, false)"
						@touchstart="hoverBand('sub', idx, false)"
						@click="submitBand('sub', band, idx)"
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
						@mouseover="hoverBand('head', idx, true)"
						@mouseleave="hoverBand('head', idx, false)"
						@touchstart="hoverBand('head', idx, false)"
						@click="submitBand('head', band, idx)"
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
				<span class="form__text-field"
					>Headliners ({{
						festHeadliners.length + "/" + AMOUNT_HEADLINERS
					}}):&nbsp;
				</span>
				<span class="form__text-value">
					<span v-for="(h, idx) in festHeadliners" :key="idx"
						>{{ h
						}}<span v-show="idx !== festHeadliners.length - 1">,&nbsp;</span>
					</span>
				</span>
			</p>
			<p
				class="form__text"
				:class="{ full: festSubBands.length === maxSubBands }"
			>
				<span class="form__text-field"
					>Other bands ({{ festSubBands.length + "/" + maxSubBands }}):&nbsp;
				</span>
				<span class="form__text-value">
					<span v-for="(b, idx) in festSubBands" :key="idx"
						>{{ b
						}}<span v-show="idx !== festSubBands.length - 1">,&nbsp;</span>
					</span>
				</span>
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
import { onUpdated, watchEffect } from "@vue/runtime-core";
import { AMOUNT_HEADLINERS, AMOUNT_BANDS } from "@/use/utils";

export default {
	emits: ["submit"],
	props: ["genre"],
	setup(props, { emit }) {
		const store = useStore();
		const bandsFromGenre = ref([]);

		const isChange = ref(false);
		const isAdded = ref(false);

		const btnSub = ref(null);

		const festSubBands = ref([]);
		const festHeadliners = ref([]);
		const bandEls = ref([]);
		const maxHeadliners = AMOUNT_HEADLINERS;
		const maxSubBands = AMOUNT_BANDS - AMOUNT_HEADLINERS;

		watchEffect(() => {
			festSubBands.value = [];
			festHeadliners.value = [];
			bandsFromGenre.value = store.getters.getBandsByGenre(props.genre);

			bandEls.value.forEach((item) =>
				item.classList.remove("hoverSub", "hoverHead", "addedSub", "addedHead")
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

		const hoverBand = (type, bandIdx, isHover) => {
			let typeBands = null;
			let maxBands = null;
			let hoverClass = null;

			/* eslint-disable prettier/prettier */
			switch (type) {
			case "sub":
				typeBands = festSubBands.value;
				maxBands = maxSubBands;
				hoverClass = "hoverSub";

				break;
			case "head":
				typeBands = festHeadliners.value;
				maxBands = AMOUNT_HEADLINERS;
				hoverClass = "hoverHead";

				break;
			}

			if (typeBands.length === maxBands) {
				return;
			}

			isHover
				? bandEls.value[bandIdx].classList.add(hoverClass)
				: bandEls.value[bandIdx].classList.remove(hoverClass);
		}

		const submitBand = (type, evt, bandIdx) => {
			let typeBands = null;
			let addClss = null;
			let hoverClass = null;

			/* eslint-disable prettier/prettier */
			switch (type) {
			case "sub":
				typeBands = festSubBands.value;
				addClss = "addedSub";
				hoverClass = "hoverSub";

				break;
			case "head":
				typeBands = festHeadliners.value;
				addClss = "addedHead";
				hoverClass = "hoverHead";

				break;
			}

			if (typeBands.includes(evt)) {
				typeBands = typeBands.filter((item) => item !== evt);
				bandEls.value[bandIdx].classList.remove(addClss, hoverClass);
			} else {
				typeBands.push(evt);
				bandEls.value[bandIdx].classList.add(addClss);
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
			hoverBand,
			submitBand,
			submitBands,
			bandEls,
			maxHeadliners,
			maxSubBands,
			btnSub,
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
	@include font-xxl;
	margin-bottom: 10px;

	span {
		white-space: nowrap;
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
		width: 250px;
		flex-shrink: 0;
	}

	&__item {
		margin-right: 20px;
		margin-bottom: 20px;
	}

	&__text {
		margin-bottom: 10px;

		&-field {
			font-family: $main-font-bold;
		}

		&-value span {
			display: inline-block;
			white-space: nowrap;
		}

		&.full {
			color: $this-color;

			.form__text-field {
				font-family: $main-font-bold-ex;
			}

			.form__text-value {
				font-family: $main-font-semibold;
			}
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
		height: 110%;
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
			left: -10px;
			padding-left: 10px;
			border-right: 2px solid $this-color;
		}

		&-head {
			right: -10px;
			padding-right: 10px;
			border-left: 2px solid $this-color;
		}

		@include hover {
			&:not(:disabled) {
				background-color: $this-color;

				svg {
					fill: $white-color;
				}
			}
		}
	}

	.text {
		white-space: nowrap;
	}

	&.hoverSub,
	&.addedSub {
		.text {
			display: block;
			transform: translateX(10%);
		}

		.band__button-head {
			display: none;
		}
	}

	&.hoverHead,
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

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.form {
		&__settings {
			width: 170px;
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
			width: 100%;
		}

		&__text {
			padding-left: 20px;
		}

		&__button {
			margin-top: 0;
		}
	}

	.lead {
		@include font-xxl;
	}

	.band {
		@include font-xs;
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
			@include font-xs;
		}
	}

	.lead {
		@include font-m;
	}

	.band {
		padding: 10px 35px;

		&__button svg {
			width: 25px;
			height: 100%;
		}
	}
}
</style>
