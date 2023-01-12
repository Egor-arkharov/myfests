<template>
	<header class="header center">
		<p class="header__title">My-Fest</p>
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
					<router-link to="/contacts" class="nav__link">Contacts</router-link>
				</li>
			</ul>
		</nav>
	</header>
</template>

<script></script>

<style scoped lang="scss">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;

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
		color: white;

		&.active {
			color: red;
		}
	}
}
</style>
