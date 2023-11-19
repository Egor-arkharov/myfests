<template>
	<app-page title="My Fest: Home" v-if="fests">
		<h1 class="main__title title" :class="{ animate: titleAnimate }">
			<span>Find </span>
			<span>or </span>
			<span>create </span>
			<span class="title__decor-wrapper">
				<span class="title__decor">your </span>
				<span class="title__decor">your </span>
			</span>
			<span>unreal </span>
			<span>music </span>
			<span>festival</span>
		</h1>

		<div class="main__body" :class="{ 'loader-backdrop': !isFests }">
			<request-tools
				v-model="search"
				@changeView="changeView"
				:view="view"
			></request-tools>

			<app-loader v-if="!isFests"></app-loader>
			<!-- <app-loader v-if="isFests"></app-loader> -->
			<p v-else-if="fests.length === 0" class="search-no">
				We&nbsp;don&rsquo;t have festivals with this artist yet. Try again!
			</p>

			<component v-else :is="'fest-' + view" :fests="fests" />
		</div>
	</app-page>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { debounce } from "vue-debounce";
import AppPage from "../components/ui/App/AppPage.vue";
import AppLoader from "../components/ui/App/AppLoader.vue";
import RequestTools from "../components/request/RequestTools.vue";
import FestTable from "../components/request/main/FestTable.vue";
import FestList from "../components/request/main/FestList.vue";

export default {
	setup() {
		const store = useStore();
		const search = ref();
		const titleAnimate = store.getters["settings/getTitleAnimate"];

		const view = computed(() => store.getters["settings/getMainView"]);

		const breakpointLG = store.state.settings.breakpoints.lg;
		const breakpointSM = store.state.settings.breakpoints.sm;

		store.commit("settings/animateTitle");

		if (window.innerWidth < breakpointLG) {
			store.commit("settings/changeMainView", "list");
		}

		if (window.innerWidth < breakpointSM) {
			store.commit("settings/changeMainView", "table");
		}

		const changeView = (viewType) => {
			if (view.value !== viewType) {
				store.commit("settings/changeMainView", viewType);
			}
		};

		let currentWidth = window.innerWidth;

		window.addEventListener(
			"resize",
			debounce(() => {
				const newWidth = window.innerWidth;

				if (newWidth === currentWidth) {
					return;
				}

				currentWidth = newWidth;

				if (window.innerWidth < breakpointLG) {
					store.commit("settings/openSidebar", "list");
				}

				if (window.innerWidth < breakpointSM) {
					store.commit("settings/openSidebar", "table");
				}
			}, 100)
		);

		const fests = computed(() =>
			store.getters["fest/getFests"].filter((fest) => {
				if (search.value && search.value.length >= 2) {
					return fest.bands.find((item) =>
						item.toLowerCase().includes(search.value.toLowerCase())
					);
				}
				return fest;
			})
		);

		const isFests = computed(() => store.getters["fest/getFests"].length);

		return {
			fests,
			search,
			view,
			isFests,
			changeView,
			titleAnimate,
		};
	},
	components: {
		AppPage,
		AppLoader,
		FestTable,
		RequestTools,
		FestList,
	},
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 48px;
	text-align: center;

	margin: 0.5rem 0 1.5rem;

	&__decor-wrapper {
		position: relative;
		font-size: 65px;
	}

	&__decor {
		color: #fff;

		&:nth-child(1) {
			color: transparent;
			-webkit-text-stroke: 1px $main-color;
		}

		&:nth-child(2) {
			position: absolute;
			left: 0;

			color: $main-color;
			animation: text-wave 4s ease-in-out infinite;
		}

		@keyframes text-wave {
			0%,
			100% {
				clip-path: polygon(
					0% 45%,
					16% 44%,
					33% 50%,
					54% 60%,
					70% 61%,
					84% 59%,
					100% 52%,
					100% 100%,
					0% 100%
				);
			}

			50% {
				clip-path: polygon(
					0% 60%,
					15% 65%,
					34% 66%,
					51% 62%,
					67% 50%,
					84% 45%,
					100% 46%,
					100% 100%,
					0% 100%
				);
			}
		}
	}

	&.animate {
		> span {
			opacity: 0;
			filter: blur(4px);
		}

		@for $i from 1 through 7 {
			> span:nth-child(#{$i}) {
				animation: fade-in
					0.8s
					(0.2s + ($i * 0.2))
					forwards
					cubic-bezier(0.11, 0, 0.5, 0);
			}
		}

		@keyframes fade-in {
			100% {
				opacity: 1;
				filter: blur(0);
			}
		}
	}
}

.loader-backdrop {
	position: relative;
	pointer-events: none;

	&::before {
		content: "";
		position: absolute;

		width: calc(100% + 20px);
		height: calc(100% + 20px);

		transform: translate(-10px, -10px);

		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 10px;
	}
}

.search-no {
	@include font-s;
	font-family: $main-font-semibold;
	margin: 30px 0;
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.title {
		font-size: 38px;

		&__decor-wrapper {
			font-size: 55px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.title {
		font-size: 30px;

		&__decor-wrapper {
			font-size: 45px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.title {
		font-size: 35px;

		&__decor-wrapper {
			display: flex;
			justify-content: center;

			font-size: 55px;
			margin: -4px 0 4px;
		}

		&__decor:nth-child(2) {
			left: 50%;
			transform: translate(-50%);
		}
	}
}
</style>
