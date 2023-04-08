<template>
	<header class="header">
		<div class="header__wrapper center">
			<p class="header__title">
				<inline-svg
					:src="require('@/assets/icons/logo.svg')"
					width="120"
					height="30"
				></inline-svg>
			</p>
			<nav class="header__nav nav">
				<button
					v-if="mobileView"
					class="btn btn--burger"
					@click.prevent="toggleMenu"
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<ul class="nav__menu">
					<li class="nav__item">
						<router-link to="/" class="nav__link">All fests</router-link>
					</li>
					<li class="nav__item">
						<router-link to="/my-fests" class="nav__link">My fests</router-link>
					</li>
					<li class="nav__item">
						<router-link to="/faq" class="nav__link">FAQ</router-link>
					</li>
					<li class="nav__item">
						<a
							class="nav__link"
							:class="{ 'nav-sidebar': sidebar }"
							href="#"
							@click.prevent="open"
							>Contacts</a
						>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script>
import { computed, ref } from "vue";
import { debounce } from "vue-debounce";
import InlineSvg from "vue-inline-svg";
import { useStore } from "vuex";

export default {
	setup() {
		const store = useStore();
		const mobileView = ref(store.getters["getMobileView"]);
		const breakpointXS = store.state.breakpoints.xs;

		const toggleMenu = () => {
			document.body.classList.toggle("menu-open");
		};

		const sidebar = computed(() => store.state.sidebar);

		window.addEventListener(
			"resize",
			debounce(() => {
				mobileView.value = window.innerWidth < breakpointXS;

				mobileView.value ? document.body.classList.remove("menu-open") : "";
			}, 100)
		);

		return {
			mobileView,
			open: () => (sidebar.value ? "" : store.commit("openSidebar")),
			toggleMenu,
			sidebar,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.header {
	height: 75px;
	padding: 20px 0;

	&__wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	&__title {
		transform: translateY(7px);
	}

	&__menu {
		display: flex;
	}
}

.nav {
	&__menu {
		display: flex;
	}

	&__item {
		margin-right: 15px;

		&:last-child {
			margin-right: 0;
		}
	}

	&__link {
		@include font-l;
		font-family: $main-font-bold;
		color: $white-color;

		@include hover {
			color: $main-color;
		}

		&.active {
			color: $black-color;
			cursor: default;
		}

		&.nav-sidebar {
			color: $main-color;
			cursor: default;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.nav {
		&__menu {
			position: fixed;
			top: calc(75px + 1rem);
			left: 0;

			transition: transform 0.25s ease-in-out;
			transform: translateX(-999px);

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100vw;

			.menu-open & {
				transform: translateX(0);
			}
		}

		&__item {
			margin-right: 0;
			margin-bottom: 10px;
		}

		&__link {
			color: $black-color;

			&.active {
				color: $main-color;
			}
		}
	}
}
</style>
