<template>
	<div class="fests">
		<ul class="fests__list">
			<li v-for="f in fests" :key="f.id" class="fests__item fest">
				<div class="fest__desc">
					<fest-desc :fest="f"></fest-desc>
				</div>
				<div class="fest__img">
					<fest-img :fest="f" :mainPage="true"></fest-img>
					<div class="buttons">
						<router-link
							v-slot="{ navigate }"
							custom
							:to="{
								name: 'FestById',
								params: { id: f.id },
							}"
						>
							<button class="btn btn--open" @click="navigate">
								<span class="btn__text">Open</span>
							</button>
						</router-link>
						<button
							class="btn btn--add"
							@click="changeMyFests(f)"
							:class="{ remove: f.added }"
						>
							<span class="btn__text">{{ f.added ? "Remove" : "Add" }}</span>
						</button>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { useStore } from "vuex";
import FestImg from "@/components/ui/Fest/FestImg.vue";
import FestDesc from "@/components/ui/Fest/FestDesc.vue";

export default {
	props: ["fests"],
	setup() {
		const store = useStore();

		const getImgUrl = (img) => require("@/assets/images/fests" + img);
		const changeMyFests = (fest) => store.commit("changeMyFests", fest);

		return {
			getImgUrl,
			changeMyFests,
		};
	},
	components: {
		FestDesc,
		FestImg,
	},
};
</script>

<style lang="scss" scoped>
.fests {
	&__item {
		padding: 20px 10%;

		border-top: 2px solid $main-color;

		&:last-child {
			border-bottom: 2px solid $main-color;
		}

		&:nth-child(even) {
			.fest__desc {
				order: 1;
				margin: 0;
				margin-left: 40px;
			}
		}
	}
}

.fest {
	display: flex;
	justify-content: space-between;

	&__desc {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 40px;
	}
}

.buttons {
	display: flex;
	justify-content: center;
}

.btn--open {
	margin-right: 10px;
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.fests {
		&__item {
			padding: 20px 0;
		}
	}
}
</style>
