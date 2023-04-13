<template>
	<div class="fest" :class="{ fest_slide: slide }">
		<p class="fest__title">{{ fest.name }}</p>
		<fest-img :fest="fest" :festPage="true"></fest-img>
		<div class="fest__desc">
			<div class="fest__desc-left">
				<fest-desc :fest="fest"></fest-desc>
			</div>
			<div class="fest__desc-right">
				<div :id="'map-' + fest.name" class="fest__map"></div>
			</div>
		</div>
		<div class="fest__lineup lineup">
			<p class="lineup__title">Lineup</p>
			<div class="lineup__wrapper">
				<div
					class="lineup__day"
					v-for="(day, idx) in Object.keys(fest.lineup)"
					:key="idx"
				>
					<p class="lineup__date">{{ makeDate()[day] }}</p>
					<p
						class="lineup__head"
						:class="[
							fest.lineup[day].headliner.font,
							fest.lineup[day].headliner.decor,
						]"
					>
						{{ fest.lineup[day].headliner.name.toUpperCase() }}
					</p>
					<div class="lineup__sub-bands">
						<p
							class="lineup__sub-band"
							v-for="(band, idx) in fest.lineup[day].subBands"
							:class="band.font"
							:key="idx"
						>
							{{ band.name }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import FestImg from "@/components/ui/Fest/FestImg.vue";
import FestDesc from "@/components/ui/Fest/FestDesc.vue";

export default {
	props: ["fest", "slide"],
	setup(props) {
		const store = useStore();
		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		onMounted(async () => {
			await store.dispatch("loadMap", props.fest);
		});

		const makeDate = () => {
			const dateStartString = props.fest.date.fullDateStart;

			const date = new Date(dateStartString);
			const monthOptions = { month: "short" };

			const day1 = date.getDate();
			const month1 = date.toLocaleString("en-US", monthOptions);
			const formattedDate1 = `${day1} ${month1}`;

			date.setDate(date.getDate() + 1);
			const day2 = date.getDate();
			const month2 = date.toLocaleString("en-US", monthOptions);
			const formattedDate2 = `${day2} ${month2}`;

			date.setDate(date.getDate() + 1);
			const day3 = date.getDate();
			const month3 = date.toLocaleString("en-US", monthOptions);
			const formattedDate3 = `${day3} ${month3}`;

			return {
				day1: formattedDate1,
				day2: formattedDate2,
				day3: formattedDate3,
			};
		};

		return {
			getImgUrl,
			makeDate,
		};
	},
	components: {
		FestDesc,
		FestImg,
	},
};
</script>

<style lang="scss" scoped>
.fest {
	padding: 20px 0 30px;

	&__title {
		font-family: $title-font;
		text-align: center;
		font-size: 64px;
		line-height: 1;
		width: 100%;
		border-bottom: 1px solid #000;
	}

	&__desc {
		display: flex;
		justify-content: space-between;
		margin: 50px 0;

		&-left {
			width: 55%;
		}

		&-right {
			width: 40%;
		}
	}

	&__map {
		height: 250px;
	}
}

.fest_slide {
	padding: 20px 25px;

	.lineup {
		width: calc(100% + 50px);
		transform: translateX(-25px);
	}
}

.lineup {
	width: calc(100% + 4rem);
	transform: translateX(-2rem);

	&__title {
		font-family: $title-font;
		text-align: center;
		font-size: 48px;
		margin-bottom: 30px;
	}

	&__wrapper {
		display: flex;
		justify-content: space-between;
	}

	&__day {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;

		width: 30%;
		padding: 0 30px;

		border-right: 1px solid $black-color;

		&:nth-child(1) {
			.lineup__sub-band {
				&:nth-child(1) {
					margin-left: 10%;
				}

				&:nth-child(2) {
					margin-left: auto;
					margin-right: 20%;
				}

				&:nth-child(3) {
					margin-left: 30%;
				}
			}
		}

		&:nth-child(2) {
			.lineup__sub-band {
				&:nth-child(1) {
					margin-left: auto;
					margin-right: 20%;
				}

				&:nth-child(2) {
					margin-left: 0;
				}

				&:nth-child(3) {
					margin-left: auto;
					margin-right: 30%;
				}
			}
		}

		&:nth-child(3) {
			border-right: none;
			.lineup__sub-band {
				&:nth-child(1) {
					margin-right: 10%;
					margin-left: auto;
				}

				&:nth-child(2) {
					margin-left: 30%;
				}

				&:nth-child(3) {
					margin-left: 40%;
				}
			}
		}
	}

	&__date {
		display: block;
		font-size: 30px;
		margin-bottom: 30px;

		text-align: center;
		width: 100%;
		padding-bottom: 10px;
		border-bottom: 1px solid #000;
	}

	&__head {
		text-align: center;
		font-size: 36px;
		line-height: 1;
		margin: auto;
		margin-bottom: 30px;
	}

	&__sub-bands {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: auto;
	}

	&__sub-band {
		font-size: 28px;
		line-height: 1;
		margin-top: 15px;
	}
}

.other-bands {
	display: flex;
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.fest {
		&__title {
			font-size: 54px;
		}
	}

	.lineup {
		&__title {
			font-size: 44px;
		}

		&__head {
			font-size: 32px;
		}

		&__sub-band {
			font-size: 26px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.fest {
		&__title {
			font-size: 44px;
		}
	}

	.lineup {
		&__title {
			font-size: 42px;
		}

		&__head {
			font-size: 30px;
		}

		&__day {
			&:nth-child(1),
			&:nth-child(3) {
				.lineup__sub-band {
					&:nth-child(1),
					&:nth-child(3) {
						margin-right: 0;
						margin-left: 0;
						text-align: left;
					}

					&:nth-child(2) {
						margin-left: 0;
						margin-right: 0;
						text-align: end;
					}
				}
			}

			&:nth-child(2) {
				.lineup__sub-band {
					&:nth-child(1),
					&:nth-child(3) {
						margin-left: 0;
						margin-right: 0;
						text-align: end;
					}

					&:nth-child(2) {
						margin-right: 0;
						margin-left: 0;
						text-align: left;
					}
				}
			}
		}

		&__sub-band {
			@include font-xxl;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.fest {
		&__title {
			font-size: 42px;
		}

		&__desc {
			flex-direction: column;

			&-left,
			&-right {
				width: 100%;
			}

			&-left {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-bottom: 25px;
			}
		}

		&__map {
			height: 200px;
		}
	}

	.lineup {
		&__title {
			font-size: 40px;
		}

		&__date {
			font-size: 26px;
		}

		&__head {
			@include font-xxl;
		}

		&__sub-band {
			@include font-xl;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.fest {
		&__title {
			font-size: 36px;
		}
	}

	.lineup {
		&__title {
			font-size: 38px;
		}

		&__wrapper {
			flex-direction: column;
			padding: 0 30px;
		}

		&__day {
			width: 100%;
			border-right: 0;
			margin-bottom: 40px;
			padding: 0;
		}

		&__head {
			font-size: 36px;
		}

		&__sub-band {
			font-size: 28px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.fest {
		&__title {
			font-size: 32px;
		}

		&__desc {
			&-left {
				flex-wrap: nowrap;
				flex-direction: column;
			}
		}

		&__map {
			height: 150px;
		}
	}

	.lineup {
		&__title {
			font-size: 36px;
		}

		&__head {
			font-size: 34px;
		}

		&__sub-band {
			font-size: 26px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xxs')}) {
	.fest {
		&__title {
			font-size: 26px;
		}
	}

	.lineup {
		&__title {
			font-size: 34px;
		}

		&__head {
			font-size: 30px;
		}

		&__sub-band {
			@include font-xxl;
		}
	}
}
</style>
