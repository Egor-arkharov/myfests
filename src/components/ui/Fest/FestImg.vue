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
</style>
