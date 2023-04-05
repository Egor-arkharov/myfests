<template>
	<div
		class="img_wrap"
		:class="{
			img_wrap_main: mainPage,
			img_wrap_fest: festPage,
			img_wrap_modal: modal,
		}"
	>
		<picture v-if="fest.img.startsWith('/img-')">
			<source type="image/webp" :srcset="getImgUrl(fest.img + '.webp')" />
			<v-lazy-image
				class="img"
				:src="getImgUrl(fest.img + '.jpg')"
				:alt="'Photo of the ' + fest.name + ' festival'"
			/>
		</picture>
		<v-lazy-image
			v-else
			class="img"
			:src="fest.img"
			:alt="'Photo of the ' + fest.name + ' festival'"
		/>
	</div>
</template>

<script>
import VLazyImage from "v-lazy-image";

export default {
	props: ["fest", "mainPage", "festPage", "modal"],
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
.img_wrap {
	background-color: lighten($grey-color, 20%);

	&_main {
		width: 350px;
		margin-bottom: 40px;

		.img {
			width: 100%;
			height: 200px;
		}
	}

	&_fest {
		.img {
			width: 100%;
			height: 400px;

			margin: 20px auto;
		}
	}

	&_modal {
		.img {
			max-height: 100px;
		}
	}
}

.img {
	display: block;
	object-fit: cover;
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.img_wrap {
		&_fest {
			.img {
				height: 300px;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.img_wrap {
		&_main {
			width: 300px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.img_wrap {
		&_fest {
			.img {
				height: 250px;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.img_wrap {
		&_fest {
			.img {
				height: 220px;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xxs')}) {
	.img_wrap {
		&_fest {
			.img {
				height: 180px;
			}
		}
	}
}
</style>
