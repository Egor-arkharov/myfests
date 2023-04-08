<template>
	<app-page title="F.A.Q.">
		<h1>FAQ</h1>
		<div class="accordion">
			<div class="accordion__title" @click="isOpenAbout = !isOpenAbout">
				What is&nbsp;this site about?
			</div>
			<div class="accordion__body" v-if="isOpenAbout">
				<div class="accordion__text">
					<p>
						This mini web-app is&nbsp;created for true lovers of&nbsp;music and
						music festivals!
					</p>
					<p>
						On&nbsp;the main page you can look at&nbsp;the greatest festivals
						in&nbsp;the world that, unfortunately, never existed.
					</p>
					<p>
						You can also create your own festival by&nbsp;choosing the name,
						date and place, your favorite artists and even choose your cover!
					</p>
					<p>
						Add festivals to&nbsp;your list and on&nbsp;the page
						<router-link to="/my-fests" class="link">My fests</router-link>
						look only at&nbsp;them. Or&nbsp;you can refresh all the data and
						start all over again!
					</p>
				</div>
				<div class="accordion__pic">
					<picture>
						<source
							type="image/webp"
							srcset="../assets/images/fests/img-1.webp"
						/>
						<v-lazy-image
							class="accordion__pic-img"
							src="../assets/images/fests/img-1.jpg"
						/>
					</picture>
				</div>
			</div>
		</div>
		<div class="accordion">
			<div class="accordion__title" @click="isOpenHow = !isOpenHow">
				How was it&nbsp;developed?
			</div>
			<div class="accordion__body" v-if="isOpenHow">
				<div class="accordion__pic">
					<picture>
						<source
							type="image/webp"
							srcset="../assets/images/fests/img-4.webp"
						/>
						<v-lazy-image
							class="accordion__pic-img"
							src="../assets/images/fests/img-4.jpg"
						/>
					</picture>
				</div>
				<div class="accordion__text">
					<ul class="list">
						<li class="list__item">
							<span class="field">Basis:</span> Vue (composition API) with
							vue-router and vuex
						</li>
						<li class="list__item">
							<span class="field">Bundler:</span> Vue CLI
						</li>
						<li class="list__item"><span class="field">Styles:</span> SASS</li>
						<li class="list__item">
							<span class="field">Requests:</span> Axios
						</li>
					</ul>

					<p class="accordion__subtext">Main libraries:</p>

					<ul class="list">
						<li class="list__item">
							<a
								class="link"
								target="_blank"
								href="https://www.npmjs.com/package/country-state-city"
								>country-state-city</a
							>
							takes data on&nbsp;cities and countries, as&nbsp;well as&nbsp;the
							latitude and longitude For Google Maps.
						</li>
						<li class="list__item">
							<a
								class="link"
								target="_blank"
								href="https://www.npmjs.com/package/@googlemaps/js-api-loader"
								>@googlemaps/js-api-loader</a
							>
							takes data on&nbsp;cities and countries, as&nbsp;well as&nbsp;the
							latitude and longitude For Google Maps
						</li>
						<li class="list__item">
							<a
								class="link"
								target="_blank"
								href="https://www.npmjs.com/package/@vuepic/vue-datepicker"
								>@vuepic/vue-datepicker</a
							>
							for date select
						</li>
						<li class="list__item">
							<a
								class="link"
								target="_blank"
								href="https://www.npmjs.com/package/v-lazy-image"
								>v-lazy-image</a
							>
							for lazy-load pictures
						</li>
						<li class="list__item">
							<a
								class="link"
								target="_blank"
								href="https://www.npmjs.com/package/vue-inline-svg"
								>vue-inline-svg</a
							>
							for inserting the Inline SVG
						</li>
						<li class="list__item">
							<a class="link" target="_blank" href="https://swiperjs.com/"
								>swiper</a
							>
							for swipers
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="accordion">
			<div class="accordion__title" @click="isOpenData = !isOpenData">
				Where is&nbsp;the data?
			</div>
			<div class="accordion__body" v-if="isOpenData">
				<div class="accordion__text">
					<p>
						The database and hosting are in&nbsp;<a
							class="link"
							target="_blank"
							href="https://firebase.google.com/"
							>Google Firebase</a
						>.
					</p>
					<p>
						There I&nbsp;sketched a&nbsp;small amount of&nbsp;data (bands,
						genres, festival names), everything else comes from libraries and
						is&nbsp;randomly displayed on&nbsp;the site each time.
					</p>
					<p>
						In&nbsp;general, the whole site is&nbsp;built on&nbsp;a&nbsp;random
						basis (even the fonts for all festivals are always different), and
						because of&nbsp;this it&nbsp;has some game element.
					</p>
					<p>
						Unfortunately,
						<a
							class="link"
							target="_blank"
							href="https://www.npmjs.com/package/country-state-city"
							>country-state-city</a
						>
						library doesn't have the most accurate data on&nbsp;the longitude
						and latitude of&nbsp;cities, so&nbsp;sometimes Google maps
						on&nbsp;the festival page shows inaccurate location, but
						in&nbsp;most cases everything is&nbsp;correct.
					</p>

					<ul class="list">
						<li class="list__item">
							<span class="field">Fest covers: </span>
							<a class="link" target="_blank" href="https://unsplash.com/"
								>Unsplash</a
							>
						</li>
						<li class="list__item">
							<span class="field">Icons: </span>
							<a class="link" target="_blank" href="https://www.svgrepo.com/"
								>SVG Repo</a
							>
						</li>
					</ul>
				</div>
				<div class="accordion__pic">
					<picture>
						<source
							type="image/webp"
							srcset="../assets/images/fests/img-13.webp"
						/>
						<v-lazy-image
							class="accordion__pic-img"
							src="../assets/images/fests/img-13.jpg"
						/>
					</picture>
				</div>
			</div>
		</div>
		<div class="accordion">
			<div class="accordion__title" @click="isOpenAuthor = !isOpenAuthor">
				Who is&nbsp;author?
			</div>
			<div class="accordion__body" v-if="isOpenAuthor">
				<div class="accordion__pic">
					<picture>
						<source
							type="image/webp"
							srcset="../assets/images/fests/img-3.webp"
						/>
						<v-lazy-image
							class="accordion__pic-img"
							src="../assets/images/fests/img-3.jpg"
						/>
					</picture>
				</div>
				<div class="accordion__text">
					<p>
						The whole idea, design and code was written by&nbsp;me,
						<span class="author">Egor Arkharov.</span>
					</p>
					<p>
						My&nbsp;contacts you can see
						<a class="link" href="#" @click.prevent="open">here</a>.
					</p>
					<p>
						Github of this project
						<a
							class="link"
							target="_blank"
							href="https://github.com/Egor-arkharov/myfests"
							>here</a
						>.
					</p>
				</div>
			</div>
		</div>
	</app-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import VLazyImage from "v-lazy-image";
import AppPage from "../components/ui/App/AppPage.vue";

export default {
	setup() {
		const store = useStore();

		return {
			isOpenAbout: ref(false),
			isOpenHow: ref(false),
			isOpenData: ref(false),
			isOpenAuthor: ref(false),
			open: () => store.commit("openSidebar"),
		};
	},
	components: {
		AppPage,
		VLazyImage,
	},
};
</script>

<style lang="scss" scoped>
h1 {
	text-align: center;
	margin-bottom: 30px;
}

.accordion {
	width: 80%;
	margin: 0 auto 15px;

	color: $black-color;
	border: 1px solid $main-color;
	border-radius: 10px;

	&:last-child {
		margin-bottom: 0;
	}

	&__title {
		position: relative;
		@include font-xl;
		font-family: $title-font;
		cursor: pointer;

		@include hover {
			color: $main-color;
		}
	}

	&__body {
		@include font-m;
		font-family: $main-font;
		margin-top: 25px;
	}

	&__title,
	&__body {
		padding: 10px 20px;
	}

	&__body {
		display: flex;
		justify-content: space-between;
	}

	&__text {
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		width: 60%;
	}

	&__subtext {
		margin: 20px 0 10px;
	}

	&__pic {
		width: 35%;
		min-height: 250px;
		background-color: lighten($grey-color, 20%);

		&-img {
			height: 100%;
			object-fit: cover;
		}
	}
}

.field {
	font-family: $main-font-bold-ex;
}

.link {
	font-family: $main-font-bold;
	color: $main-color;

	@include hover {
		color: darken($main-color, 20%);
	}
}

.author {
	font-family: $main-font-semibold;
	white-space: nowrap;
}

p:not(:last-child) {
	margin-bottom: 7px;
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.accordion {
		width: 100%;

		&__body {
			flex-direction: column;
		}

		&__text,
		&__pic {
			width: 100%;
		}

		&__pic {
			height: 200px;
			margin-top: 35px;
			order: 1;

			&-img {
				width: 100%;
			}
		}
	}
}
</style>
