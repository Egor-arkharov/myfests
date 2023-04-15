<template>
	<div
		class="wrap"
		:class="{
			wrap_main: mainPage,
			wrap_fest: festPage,
			wrap_modal: modal,
			wrap_myfests: myFests,
		}"
	>
		<picture v-if="fest.img.startsWith('/img-')">
			<source type="image/webp" :srcset="getImgUrl(fest.img + '.webp')" />
			<v-lazy-image
				class="wrap__img"
				:class="{
					wrap_main__img: mainPage,
					wrap_fest__img: festPage,
					wrap_modal__img: modal,
					wrap_myfests__img: myFests,
				}"
				:src="getImgUrl(fest.img + '.jpg')"
				:alt="'Photo of the ' + fest.name + ' festival'"
			/>
		</picture>
		<v-lazy-image
			v-else
			class="wrap__img"
			:class="{
				wrap_main__img: mainPage,
				wrap_fest__img: festPage,
				wrap_modal__img: modal,
				wrap_myfests__img: myFests,
			}"
			:src="fest.img"
			:alt="'Photo of the ' + fest.name + ' festival'"
		/>
	</div>
</template>

<script>
import VLazyImage from "v-lazy-image";

export default {
	props: ["fest", "mainPage", "festPage", "modal", "myFests"],
	setup() {
		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		return {
			getImgUrl,
		};
	},
	components: {
		VLazyImage,
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	background-color: lighten($grey-color, 20%);

	&_main {
		width: 350px;
		margin-bottom: 40px;

		&__img {
			width: 100%;
			height: 200px;
		}
	}

	&_fest {
		&__img {
			width: 100%;
			height: 400px;

			margin: 20px auto;
		}
	}

	&_modal {
		&__img {
			max-height: 100px;
		}
	}

	&_myfests {
		user-select: none;
		border-radius: 50%;

		&__img {
			width: 150px;
			height: 150px;
			object-fit: cover;
			border-radius: 50%;
		}
	}

	&__img {
		display: block;
		object-fit: cover;
	}
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.wrap {
		&_fest__img {
			height: 300px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.wrap {
		&_fest__img {
			height: 250px;
		}

		&_myfests__img {
			width: 120px;
			height: 120px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.wrap {
		&_main {
			width: 300px;
		}

		&_myfests__img {
			width: 120px;
			height: 120px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.wrap {
		&_fest__img {
			height: 220px;
		}

		&_myfests__img {
			width: 100px;
			height: 100px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xxs')}) {
	.img_wrap {
		&_fest__img {
			height: 180px;
		}

		&_myfests__img {
			width: 80px;
			height: 80px;
		}
	}
}
</style>
