<template>
	<div class="img-wrap">
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
	props: ["fest"],
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
.img-wrap {
	background-color: lighten($grey-color, 20%);
}

.img {
	display: block;
	width: 100%;
	height: 400px;

	margin: 20px auto;
	object-fit: cover;
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.img {
		height: 300px;
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.img {
		height: 250px;
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.img {
		height: 220px;
	}
}

@media (max-width: #{map-get($breakpoints, 'xxs')}) {
	.img {
		height: 180px;
	}
}
</style>
