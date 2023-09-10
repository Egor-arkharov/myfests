<template>
	<transition name="transition">
		<div class="sidebar" v-if="sidebar">
			<div class="sidebar__wrapper center">
				<button class="btn btn--icon sidebar-close" @click.prevent="close">
					<inline-svg
						:src="require(`@/assets/icons/cross.svg`)"
						width="22"
						height="22"
					></inline-svg>
				</button>
				<div class="sidebar__content bio">
					<div class="bio__general">
						<div class="bio__pic"></div>
						<p class="bio__first">
							<span class="bio__name">Egor Arkharov</span>
							<span class="bio__location">Tel Aviv, Israel</span>
						</p>
					</div>
					<p class="bio__greeting">
						<span>Hi!,</span> I&nbsp;am a&nbsp;Frontend Web Developer and this
						is&nbsp;my&nbsp;first pet-project on&nbsp;Vue.
					</p>
					<div class="bio__desc">
						<div class="bio__block">
							<div>
								I&nbsp;have more than 2&nbsp;years of&nbsp;commercial experience
								in&nbsp;Web Development and in&nbsp;my&nbsp;work faced with
								different modern and old technologies like:
								<ul class="list">
									<li
										class="list__item"
										v-for="(item, idx) in hardSkills"
										:key="idx"
									>
										{{ item }}
									</li>
								</ul>
							</div>
						</div>
						<div class="bio__block">
							<p>
								I&nbsp;am from Moscow, but since March 2022&nbsp;I've lived
								in&nbsp;Tbilisi and now in&nbsp;Tel-Aviv.
							</p>
							<div class="social">
								<p>Here are my social links:</p>
								<ul class="social__list">
									<li
										class="social__item"
										v-for="(item, idx) in social"
										:key="idx"
									>
										<a class="social__link" :href="item.link" target="_blank">
											<inline-svg
												:src="require(`@/assets/icons/social/${item.name}.svg`)"
												class="social__icon"
												width="30"
												height="30"
											></inline-svg>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import InlineSvg from "vue-inline-svg";

export default {
	setup() {
		const store = useStore();
		const sidebar = computed(() => store.getters["settings/getSideBar"]);

		const social = [
			{
				name: "linkedin",
				link: "https://www.linkedin.com/in/egor-arkharov",
			},
			{
				name: "facebook",
				link: "https://www.facebook.com/egor.arkharov/",
			},
			{
				name: "telegram",
				link: "https://t.me/EgorArkharov",
			},
			{
				name: "github",
				link: "https://github.com/Egor-arkharov",
			},
			{
				name: "mail",
				link: "mailto:egorarkharov@gmail.com",
			},
		];

		const hardSkills = [
			"Vue,",
			"Typescript,",
			"Pug / ejs,",
			"jQuery,",
			"MongoDB,",
			"WebPack,",
			"Gitlab,",
			"even install Linux machine on Windows!",
		];

		return {
			social,
			hardSkills,
			sidebar,
			close: () => store.commit("settings/closeSidebar"),
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.sidebar {
	position: fixed;
	right: 0;
	top: 0;

	width: $sidebar-width;
	height: 100%;

	color: $black-color;
	z-index: 1;

	&__wrapper {
		position: relative;
		height: 100%;

		padding: 50px 10px 15px;

		background-color: $white-color;
		border-left: 2px solid $main-color;
	}
}

.sidebar-close {
	position: absolute;
	top: 10px;
	right: 20px;

	font-size: 30px;
	width: 30px;
	height: 30px;
}

.bio {
	overflow: auto;
	max-height: 100%;
	padding-right: 5px;

	&::-webkit-scrollbar {
		width: 5px;
	}

	&__greeting span {
		display: block;
	}

	&__general {
		display: flex;
		align-items: center;

		margin-bottom: 20px;
	}

	&__pic {
		position: relative;
		width: 130px;
		height: 130px;

		margin-right: 20px;

		border: 2px solid $main-color;
		border-radius: 50%;

		overflow: hidden;

		&::before {
			content: "";
			position: absolute;

			width: 100%;
			height: 100%;

			top: 50%;
			left: 50%;
			transform: translate(-45%, 10%) scale(2.5);

			background-image: url("../assets/images/author.jpg");
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
		}
	}

	&__first {
		display: flex;
		flex-direction: column;
	}

	&__name {
		display: block;
		margin-bottom: 5px;

		@include font-xxl;
		font-family: $main-font-bold;
	}

	&__location {
		display: block;
		font-family: $main-font-italic;
	}
}

.social {
	padding-top: 10px;

	&__list {
		display: flex;
	}

	&__item:not(:last-child) {
		margin-right: 10px;
	}

	&__icon {
		@include hover {
			fill: $main-color;
		}
	}
}

.list {
	margin: 10px 0;
}

p {
	margin-bottom: 10px;

	&:last-child {
		margin-bottom: 0;
	}
}

.transition-enter-active,
.transition-leave-active {
	transform: translateX(0);
	transition: transform 0.5s ease-out;
}

.transition-enter-from,
.transition-leave-to {
	transform: translateX(999px);
}

@media screen and (min-width: 1601px) {
	.center {
		max-width: 100%;
	}
}

@media (max-width: #{map-get($breakpoints, 'xxl')}) {
	.sidebar {
		right: 0;
		top: 75px;
		width: 100%;
		height: auto;
		z-index: 4;

		&__wrapper {
			border-radius: 10px;
			border: 2px solid $main-color;
		}
	}

	.transition-enter-from,
	.transition-leave-to {
		transform: translateX(100%);
	}

	.bio {
		max-height: 70vh;

		&__greeting {
			margin-bottom: 20px;
		}

		&__desc {
			display: flex;
			gap: 25px;
		}

		&__block {
			width: 40%;
		}
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding-left: 0;

		&__item {
			width: 40%;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.sidebar {
		&__wrapper {
			padding-top: 35px;
		}
	}

	.bio {
		&__greeting {
			margin-bottom: 10px;
		}

		&__desc {
			display: flex;
			justify-content: space-between;
			gap: 35px;
		}

		&__block {
			width: 50%;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.bio {
		&__desc {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		&__block {
			width: 100%;
		}

		&__pic {
			width: 110px;
			height: 110px;
		}
	}

	.social {
		padding: 0;
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.bio {
		&__pic {
			width: 90px;
			height: 90px;
		}

		&__name {
			@include font-xl;
		}
	}

	.transition-enter-active,
	.transition-leave-active {
		transform: translateY(0);
		transition: transform 0.3s ease-in-out;
	}

	.transition-enter-from,
	.transition-leave-to {
		transform: translateY(999px);
	}
}
</style>

<style lang="scss">
@media screen and (min-width: 1601px) {
	body {
		transition: padding 1s ease;
	}

	.body {
		&--sidebar {
			padding-right: $sidebar-width;
		}
	}
}
</style>
