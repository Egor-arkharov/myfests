<template>
	<div class="fest">
		<p class="fest__title">{{ fest.name }}</p>
		<picture v-if="fest.img.startsWith('/img-')">
			<source type="image/webp" :srcset="getImgUrl(fest.img + '.webp')" />
			<img
				class="fest__img"
				:src="getImgUrl(fest.img + '.jpg')"
				:alt="'Photo of the ' + fest.name + ' festival'"
			/>
		</picture>
		<img v-else class="fest__img" :src="fest.img" alt="hi" />
		<div class="fest__desc">
			<div class="fest__desc-left text">
				<p class="text__block">
					<span class="text__field">Place: </span>
					<span class="text__value">{{
						fest.place.name + ", " + fest.place.countryName
					}}</span>
				</p>
				<p class="text__block">
					<span class="text__field">Date: </span>
					<span class="text__value">{{
						fest.date.start + "-" + fest.date.end
					}}</span>
				</p>
				<p class="text__block">
					<span class="text__field">Genre: </span>
					<span class="text__value">{{ fest.genre }}</span>
				</p>
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
					<p class="lineup__head">
						{{ fest.lineup[day].headliner.toUpperCase() }}
					</p>
					<div class="lineup__sub-bands">
						<p
							class="lineup__sub-band"
							v-for="(band, idx) in fest.lineup[day].subBands"
							:key="idx"
						>
							{{ band }}
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

export default {
	props: ["fest"],
	setup(props) {
		const store = useStore();
		const getImgUrl = (img) => require("@/assets/images" + img);

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
};
</script>

<style lang="scss" scoped>
.fest {
	padding-bottom: 50px;

	&__title {
		text-align: center;
		font-size: 64px;
		font-weight: 900;
		width: 100%;
		border-bottom: 1px solid #000;
	}

	&__img {
		display: block;
		width: 100%;
		height: 400px;

		margin: 20px auto;
		object-fit: cover;
	}

	&__desc {
		display: flex;
		justify-content: space-between;
		margin: 50px 0;

		&-right {
			width: 40%;
		}
	}

	&__map {
		height: 250px;
	}
}

.text {
	&__block {
		color: black;
		margin-bottom: 15px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__field {
		font-size: 24px;
		font-weight: 900;
	}

	&__value {
		font-size: 24px;
	}
}

.lineup {
	&__title {
		text-align: center;
		font-size: 48px;
		font-weight: 900;
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

		border-right: 1px solid black;

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
		font-weight: 900;
		font-style: italic;

		margin: auto 0;
	}

	&__sub-bands {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 30px;
	}

	&__sub-band {
		font-size: 32px;
		margin-top: 10px;
		white-space: nowrap;
	}
}
</style>
