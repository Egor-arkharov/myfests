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
		<fest-lineup :fest="fest"></fest-lineup>
	</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import FestImg from "@/components/ui/Fest/FestImg.vue";
import FestDesc from "@/components/ui/Fest/FestDesc.vue";
import FestLineup from "@/components/ui/Fest/FestLineup.vue";

export default {
	props: ["fest", "slide"],
	setup(props) {
		const store = useStore();
		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		onMounted(async () => {
			await store.dispatch("loadMap", props.fest);
		});

		return {
			getImgUrl,
		};
	},
	components: {
		FestDesc,
		FestImg,
		FestLineup,
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

.other-bands {
	display: flex;
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.fest {
		&__title {
			font-size: 54px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.fest {
		&__title {
			font-size: 44px;
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
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.fest {
		&__title {
			font-size: 36px;
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
}

@media (max-width: #{map-get($breakpoints, 'xxs')}) {
	.fest {
		&__title {
			font-size: 26px;
		}
	}
}
</style>
