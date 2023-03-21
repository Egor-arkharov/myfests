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
						<a class="nav__link" href="#" @click.prevent="open">Contacts</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import { useStore } from "vuex";

export default {
	setup() {
		const store = useStore();

		return {
			open: () => store.commit("openSidebar"),
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.header {
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
	}
}
</style>
