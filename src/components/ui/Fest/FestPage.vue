<template>
	<div class="fest">
		<p class="fest__title">{{ fest.name }}</p>
		<fest-img :fest="fest"></fest-img>
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
	props: ["fest"],
	setup(props) {
		const store = useStore();
		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		console.log(props.fest);

		onMounted(async () => {
			await store.dispatch("loadMap", props.fest);
		});

		const makeDate = () => {
			const date1Str = props.fest.date.start;
			const date1Date = new Date(
				date1Str.replace(/(\d\d).(\d\d).(\d\d\d\d)/, "$3-$2-$1")
			);

			const copyDay1 = new Date(date1Date);
			const date2 = copyDay1.setDate(copyDay1.getDate() + 1);
			const date2Date = new Date(date2);

			const date3Str = props.fest.date.end;
			const date3Date = new Date(
				date3Str.replace(/(\d\d).(\d\d).(\d\d\d\d)/, "$3-$2-$1")
			);

			const day1 = date1Str.slice(0, 2);
			const month1 = date1Date.toLocaleString("en", { month: "short" });

			const day2 = date2Date.toLocaleString().slice(0, 2);
			const month2 = date2Date.toLocaleString("en", { month: "short" });

			const day3 = date3Str.slice(0, 2);
			const month3 = date3Date.toLocaleString("en", { month: "short" });

			return {
				day1: day1 + " " + month1,
				day2: day2 + " " + month2,
				day3: day3 + " " + month3,
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
			font-size: 24px;
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
			font-size: 24px;
		}

		&__sub-band {
			font-size: 22px;
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
		}

		&__day {
			width: 100%;
			border-right: 0;
			margin-bottom: 40px;
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
			font-size: 24px;
		}
	}
}
</style>
