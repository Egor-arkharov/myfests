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
						<router-link to="/sandbox" class="nav__link">SandBox</router-link>
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
			<div class="header__auth auth">
				<button class="auth__button btn" @click="openModalAuth">
					<span class="auth__logo">
						<inline-svg
							v-bind:src="
								isLoggedIn && userNick
									? require('@/assets/icons/user_auth.svg')
									: require('@/assets/icons/user_no-auth.svg')
							"
							width="30"
							height="30"
						></inline-svg>
					</span>
					<span v-if="userNick" class="auth__text">{{ userNick }}</span>
					<span v-else class="auth__text">AUTH</span>
				</button>
			</div>
		</div>
	</header>
	<teleport to="body">
		<app-modal
			v-if="modal"
			@close="modal = false"
			:modalClass="modalClass"
			:title="modalTitle"
		>
			<auth-modal v-if="!isLoggedIn" />
			<user-modal v-else />
		</app-modal>
	</teleport>
</template>

<script>
import { computed, ref } from "vue";
import { debounce } from "vue-debounce";
import InlineSvg from "vue-inline-svg";
import { useStore } from "vuex";

import AppModal from "@/components/ui/App/AppModal.vue";
import authModal from "@/components/request/modal/authModal.vue";
import userModal from "@/components/request/modal/userModal.vue";

export default {
	setup() {
		const store = useStore();
		const mobileView = ref(store.getters["settings/getMobileView"]);
		const breakpointXS = store.state.settings.breakpoints.xs;
		const modal = ref();
		const modalClass = ref("");
		const modalTitle = ref("");

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

		const openModalAuth = () => {
			modal.value = true;

			if (!isLoggedIn.value) {
				modalClass.value = "modal--auth";
				modalTitle.value = "Welcome to the club";
			} else {
				modalClass.value = "modal--user";
				modalTitle.value = "Settings";
			}
		};

		const isLoggedIn = computed(() => store.getters["auth/getLoggedIn"]);
		const userNick = computed(() => store.getters["auth/getUserNick"]);

		return {
			mobileView,
			open: () => (sidebar.value ? "" : store.commit("settings/openSidebar")),
			toggleMenu,
			openModalAuth,
			modal,
			modalClass,
			modalTitle,
			sidebar,
			isLoggedIn,
			userNick,
		};
	},
	components: {
		InlineSvg,
		AppModal,
		authModal,
		userModal,
	},
};
</script>

<style lang="scss" scoped>
.header {
	height: 85px;
	padding: 20px 0;

	&__wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 100%;
	}

	&__title {
		transform: translateY(7px);
	}

	&__menu {
		display: flex;
	}

	&__nav {
		margin-left: auto;
		margin-right: 40px;
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
		@include font-m;
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

.auth {
	position: relative;

	&__logo {
		width: 30px;
		height: 30px;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__button {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	&__text {
		font-family: $main-font-bold;
		color: white;
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

<style lang="scss">
.auth__button {
	@include hover {
		path {
			stroke: $main-color;
		}
	}
}
</style>
