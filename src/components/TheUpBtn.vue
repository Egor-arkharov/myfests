<template>
	<button
		class="btn btn--up"
		@click.prevent="scrollUp"
		:disabled="disabled"
		ref="scrollBtn"
	>
		<inline-svg
			:src="require(`@/assets/icons/arrow.svg`)"
			width="30"
			height="30"
		></inline-svg>
	</button>
</template>

<script>
import { onMounted, ref } from "vue";
import { debounce } from "vue-debounce";
import InlineSvg from "vue-inline-svg";

export default {
	setup() {
		const scrollBtn = ref(null);
		const disabled = ref(true);

		onMounted(() => {
			window.addEventListener(
				"scroll",
				debounce(() => {
					disabled.value =
						window.scrollY >= 0 && window.scrollY < window.innerHeight / 2
							? true
							: false;
				}, 50)
			);
		});

		const scrollUp = () => {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});

			disabled.value = false;
		};

		return {
			scrollBtn,
			disabled,
			scrollUp,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.btn--up {
	position: fixed;
	bottom: 10%;
	right: 5%;

	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1px;

	border: 1px solid $main-color;
	background-color: $white-color;
	border-radius: 50%;

	z-index: 3;
}
</style>
