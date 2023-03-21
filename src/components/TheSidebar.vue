<template>
	<div class="sidebar" v-if="sidebar">
		<button class="btn btn--icon sidebar-close" @click.prevent="close">
			&times;
		</button>
		<div class="sidebar__content bio">
			<div class="bio__general">
				<div class="bio__pic"></div>
				<p class="bio__first">
					<span class="bio__name">Egor Arkharov</span>
					<span class="bio__location">Tel Aviv, Israel</span>
				</p>
			</div>
			<p>
				<span class="greeting">Hi!,</span> I&nbsp;am a&nbsp;Frontend Web
				Developer and this is&nbsp;my&nbsp;first pet-project on&nbsp;Vue.
			</p>
			<div>
				I&nbsp;have more than 2&nbsp;years of&nbsp;commercial experience
				in&nbsp;Web Development and in&nbsp;my&nbsp;work faced with different
				modern and old technologies like:
				<ul class="list">
					<li class="list__item" v-for="(item, idx) in hardSkills" :key="idx">
						{{ item }}
					</li>
				</ul>
			</div>
			<p>
				I&nbsp;am from Moscow, but since March 2022&nbsp;I've lived
				in&nbsp;Tbilisi and now in&nbsp;Tel-Aviv.
			</p>
			<div class="social">
				<p>Here are my social links:</p>
				<ul class="social__list">
					<li class="social__item" v-for="(item, idx) in social" :key="idx">
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
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import InlineSvg from "vue-inline-svg";

export default {
	setup() {
		const store = useStore();
		const sidebar = computed(() => store.state.sidebar);

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
			close: () => store.commit("closeSidebar"),
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

	width: 350px;
	height: 100%;
	padding: 50px 10px 15px;

	color: $black-color;
	background: $white-color;
	border-left: 2px solid $main-color;
	z-index: 3;
}

.sidebar-close {
	position: absolute;
	top: 10px;
	right: 20px;

	font-size: 30px;
	width: 30px;
	height: 30px;
	cursor: pointer;

	@include hover {
		color: $main-color;
	}
}

.greeting {
	display: block;
}

.bio {
	overflow: auto;
	max-height: 100%;
	padding-right: 5px;

	&::-webkit-scrollbar {
		width: 5px;
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

		@include font-xl;
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

p:not(:last-child) {
	margin-bottom: 10px;
}
</style>
